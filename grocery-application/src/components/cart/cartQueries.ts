import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios/axios";
import type { CartItem } from "@/types/grocery";

type CartApiResponse = {
  data?: {
    items?: CartItem[];
  };
};

export const CART_QUERY_KEY = ["cart-items"] as const;

async function fetchCartItems(): Promise<CartItem[]> {
  const response = await axiosInstance.get<CartApiResponse>("/api/cart", {
    withCredentials: true,
  });
  return response.data?.data?.items ?? [];
}

async function addItemToCart(itemId: string): Promise<void> {
  await axiosInstance.post("/api/cart", { itemId }, { withCredentials: true });
}

async function removeItemFromCart(itemId: string): Promise<void> {
  await axiosInstance.delete("/api/cart", {
    data: { itemId },
    withCredentials: true,
  });
}

async function clearServerCart(): Promise<void> {
  await axiosInstance.delete("/api/cart", {
    data: {},
    withCredentials: true,
  });
}

export function useCartQuery() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCartItems,
  });
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearServerCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
