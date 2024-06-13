import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)[":id"]["$patch"]
>["json"];

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories[":id"]["$patch"]({
        param: { id },
        json,
      });
      if (!res.ok) {
        throw new Error("Failed to edit Category!");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Category Updated!");
    },
    onError: () => {
      toast.error("Failed to edit Category!");
    },
  });
  return mutation;
};

export default useEditCategory;