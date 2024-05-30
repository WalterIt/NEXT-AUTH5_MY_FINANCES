import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";
import useNewCategory from "../hooks/use-new-category";
import {
  CategoryForm,
  FormValues,
} from "@/features/categories/components/category-form";
import { useCreateCategory } from "../api/use-create-category";
  
  export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();
    const mutation = useCreateCategory();
    const onSubmit = (formValues: FormValues) => {
      // console.log({formValues})
      mutation.mutate(formValues, {
        onSuccess: () => {
          onClose();
        },
      });
    };

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Category</SheetTitle>
            <SheetDescription>
              Create a new Category to organize your Transactions.
            </SheetDescription>
          </SheetHeader>
          <CategoryForm
            onSubmit={onSubmit}
            defaultValues={{ name: "" }}
            // disabled={false}
            disabled={mutation.isPending}
          />
        </SheetContent>
      </Sheet>
    );
  };