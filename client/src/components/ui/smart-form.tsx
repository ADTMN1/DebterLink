import React from 'react';
import { UseFormReturn, FieldValues, FieldPath } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './form';
import { EnhancedInput } from './enhanced-input';
import { FormProgress, ValidationFeedback } from './validation-feedback';
import { Button } from './button';
import { useRealtimeValidation } from '@/hooks/use-realtime-validation';
import { useFormAnalytics } from '@/hooks/use-form-analytics';
import { Loader2 } from 'lucide-react';

interface SmartFormField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  sanitizer?: string;
  showStrength?: boolean;
  strengthType?: 'password' | 'username' | 'email';
  required?: boolean;
}

interface SmartFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fields: SmartFormField[];
  onSubmit: (data: T) => void | Promise<void>;
  submitLabel?: string;
  showProgress?: boolean;
  className?: string;
}

export function SmartForm<T extends FieldValues>({
  form,
  fields,
  onSubmit,
  submitLabel = 'Submit',
  showProgress = true,
  className,
}: SmartFormProps<T>) {
  const realtime = useRealtimeValidation(form);
  const analytics = useFormAnalytics(form);

  const handleSubmit = form.handleSubmit(async (data) => {
    const metrics = analytics.getFormMetrics();
    console.log('Form submission metrics:', metrics);
    await onSubmit(data);
  });

  return (
    <div className={className}>
      {showProgress && (
        <FormProgress progress={realtime.formProgress} className="mb-6" />
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((fieldConfig) => (
            <FormField
              key={fieldConfig.name}
              control={form.control}
              name={fieldConfig.name as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {fieldConfig.label}
                    {fieldConfig.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  <FormControl>
                    <EnhancedInput
                      type={fieldConfig.type}
                      placeholder={fieldConfig.placeholder}
                      sanitizer={fieldConfig.sanitizer}
                      validationState={realtime.getFieldState(fieldConfig.name).state}
                      validationMessage={realtime.getFieldState(fieldConfig.name).message}
                      showStrength={fieldConfig.showStrength}
                      strengthType={fieldConfig.strengthType}
                      {...field}
                      onFocus={() => analytics.trackFieldFocus(fieldConfig.name)}
                      onChange={(e) => {
                        field.onChange(e);
                        realtime.validateField(fieldConfig.name as FieldPath<T>, e.target.value);
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        analytics.trackFieldCompletion(fieldConfig.name);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={form.formState.isSubmitting || !realtime.isFormValid()}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}