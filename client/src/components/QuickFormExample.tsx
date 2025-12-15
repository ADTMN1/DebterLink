import { useUserForm, useFormPersistence, useDraftManagement } from '@/hooks';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SanitizedInput } from '@/components/ui/sanitized-input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// Example: User creation form with all hook features
export function QuickUserForm() {
  const { form, handleSubmit } = useUserForm('create');
  const { saveDraft, loadDraft, hasDraft, deleteDraft } = useDraftManagement(form, 'user-creation');

  // Auto-save as draft (excluding password)
  useFormPersistence(form, 'user-form-auto', {
    exclude: ['password'],
    debounceMs: 2000,
    onSave: saveDraft,
  });

  // Load draft on mount
  useEffect(() => {
    if (hasDraft()) {
      loadDraft();
    }
  }, [hasDraft, loadDraft]);

  const onSubmit = handleSubmit(async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('User created:', data);
    deleteDraft(); // Clear draft on success
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <SanitizedInput sanitizer="name" placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <SanitizedInput sanitizer="email" type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}