import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { executeMySql, queryMySql } from "@/utils/mysql/client";
import type { GroceryItem } from "@/types/grocery";
import { getAuthUserFromRequest } from "@/utils/auth/auth";

type CartWithItemRow = RowDataPacket & {
	item_id: string;
	name: string;
	price: number;
	unit: string;
	description: string;
	tag: string;
	quantity: number;
};

async function ensureCartTable() {
	await executeMySql(
		`
			CREATE TABLE IF NOT EXISTS cart_items (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_email VARCHAR(255) NOT NULL,
				item_id VARCHAR(100) NOT NULL,
				quantity INT NOT NULL DEFAULT 1,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				UNIQUE KEY unique_user_item (user_email, item_id)
			)
		`
	);
}

async function ensureItemsTable() {
	await executeMySql(
		`
			CREATE TABLE IF NOT EXISTS items (
				id VARCHAR(100) PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				price DECIMAL(10,2) NOT NULL DEFAULT 0,
				unit VARCHAR(100) DEFAULT '',
				description TEXT,
				tag VARCHAR(100) DEFAULT ''
			)
		`
	);
}

async function loadUserCart(userEmail: string): Promise<Array<GroceryItem & { quantity: number }>> {
	const result = await queryMySql<CartWithItemRow>(
		`
			SELECT i.id as item_id, i.name, i.price, i.unit, i.description, i.tag, c.quantity
			FROM cart_items c
			JOIN items i ON i.id = c.item_id
			WHERE c.user_email = ?
			ORDER BY c.updated_at DESC
		`,
		[userEmail]
	);

	return result.rows.map((row) => ({
		id: String(row.item_id),
		name: String(row.name),
		price: Number(row.price),
		unit: String(row.unit),
		description: String(row.description),
		tag: String(row.tag),
		quantity: Number(row.quantity),
	}));
}

function unauthorizedResponse() {
	return NextResponse.json(
		{
			isApiHandled: true,
			isRequestSuccess: false,
			statusCode: 401,
			message: "Unauthorized",
			data: null,
			exception: [],
		},
		{ status: 401 }
	);
}

function forbiddenResponse() {
	return NextResponse.json(
		{
			isApiHandled: true,
			isRequestSuccess: false,
			statusCode: 403,
			message: "Forbidden",
			data: null,
			exception: [],
		},
		{ status: 403 }
	);
}

export async function GET(request: Request) {
	try {
		const authUser = getAuthUserFromRequest(request);
		if (!authUser) {
			return unauthorizedResponse();
		}

		if (authUser.role !== "user" && authUser.role !== "admin") {
			return forbiddenResponse();
		}

		await ensureCartTable();
		await ensureItemsTable();
		const cartItems = await loadUserCart(authUser.email);

		return NextResponse.json({
			isApiHandled: true,
			isRequestSuccess: true,
			statusCode: 200,
			message: "Success",
			data: { items: cartItems },
			exception: [],
		});
	} catch (error) {
		console.error("[Cart API] GET failed:", error);
		return NextResponse.json(
			{
				isApiHandled: false,
				isRequestSuccess: false,
				statusCode: 500,
				message: "Failed to load cart",
				data: null,
				exception: [],
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const authUser = getAuthUserFromRequest(request);
		if (!authUser) {
			return unauthorizedResponse();
		}

		if (authUser.role !== "user" && authUser.role !== "admin") {
			return forbiddenResponse();
		}

		const body = (await request.json()) as { itemId?: string };
		if (!body.itemId) {
			return NextResponse.json(
				{
					isApiHandled: true,
					isRequestSuccess: false,
					statusCode: 400,
					message: "Invalid itemId",
					data: null,
					exception: [],
				},
				{ status: 400 }
			);
		}

		await ensureCartTable();
		await ensureItemsTable();

		const itemCheck = await queryMySql<RowDataPacket & { id: string }>(
			`SELECT id FROM items WHERE id = ? LIMIT 1`,
			[body.itemId]
		);

		if (itemCheck.rows.length === 0) {
			return NextResponse.json(
				{
					isApiHandled: true,
					isRequestSuccess: false,
					statusCode: 404,
					message: "Item not found",
					data: null,
					exception: [],
				},
				{ status: 404 }
			);
		}

		await executeMySql(
			`
				INSERT INTO cart_items (user_email, item_id, quantity)
				VALUES (?, ?, 1)
				ON DUPLICATE KEY UPDATE quantity = quantity + 1
			`,
			[authUser.email, body.itemId]
		);

		const cartItems = await loadUserCart(authUser.email);

		return NextResponse.json({
			isApiHandled: true,
			isRequestSuccess: true,
			statusCode: 200,
			message: "Success",
			data: { items: cartItems },
			exception: [],
		});
	} catch (error) {
		console.error("[Cart API] POST failed:", error);
		return NextResponse.json(
			{
				isApiHandled: false,
				isRequestSuccess: false,
				statusCode: 500,
				message: "Failed to update cart",
				data: null,
				exception: [],
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const authUser = getAuthUserFromRequest(request);
		if (!authUser) {
			return unauthorizedResponse();
		}

		if (authUser.role !== "user" && authUser.role !== "admin") {
			return forbiddenResponse();
		}

		const body = (await request.json().catch(() => ({}))) as { itemId?: string };

		await ensureCartTable();
		await ensureItemsTable();

		if (!body.itemId) {
			await executeMySql(`DELETE FROM cart_items WHERE user_email = ?`, [authUser.email]);
		} else {
			await executeMySql(
				`
					UPDATE cart_items
					SET quantity = quantity - 1
					WHERE user_email = ? AND item_id = ?
				`,
				[authUser.email, body.itemId]
			);

			await executeMySql(
				`
					DELETE FROM cart_items
					WHERE user_email = ? AND item_id = ? AND quantity <= 0
				`,
				[authUser.email, body.itemId]
			);
		}

		const cartItems = await loadUserCart(authUser.email);

		return NextResponse.json({
			isApiHandled: true,
			isRequestSuccess: true,
			statusCode: 200,
			message: "Success",
			data: { items: cartItems },
			exception: [],
		});
	} catch (error) {
		console.error("[Cart API] DELETE failed:", error);
		return NextResponse.json(
			{
				isApiHandled: false,
				isRequestSuccess: false,
				statusCode: 500,
				message: "Failed to update cart",
				data: null,
				exception: [],
			},
			{ status: 500 }
		);
	}
}
