# ARIA Live Regions Usage Guide

## Components Available

### 1. Announcer (Global)
Already added to `App.tsx`. Provides global aria-live regions.

### 2. FormError Component
Use for form validation messages with automatic screen reader announcements.

```tsx
import { FormError } from "@/components/ui/form-error";

<FormError message={errors.email?.message} />
```

### 3. DataTableStatus Component
Use for announcing table updates to screen readers.

```tsx
import { DataTableStatus } from "@/components/ui/data-table-status";

{isLoading && <DataTableStatus message="Loading data..." />}
{data && <DataTableStatus message={`Loaded ${data.length} items`} />}
```

### 4. a11y.announce() Function
Use programmatically to announce messages.

```tsx
import { a11y } from "@/lib/a11y";

// Polite announcement (default)
a11y.announce("Form saved successfully");

// Assertive announcement (for errors)
a11y.announce("Error: Please fix validation errors", "assertive");
```

## Usage Examples

### Form Validation (Method 1: FormError)
```tsx
import { FormError } from "@/components/ui/form-error";

<form onSubmit={handleSubmit}>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    {...register("email")} 
    aria-invalid={errors.email ? "true" : "false"}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
  <FormError id="email-error" message={errors.email?.message} />
  
  <Button type="submit">Submit</Button>
</form>
```

### Form Validation (Method 2: FormField - Recommended)
```tsx
import { FormField } from "@/components/ui/form-field";

<form onSubmit={handleSubmit}>
  <FormField
    label="Email"
    error={errors.email?.message}
    required
    {...register("email")}
  />
  
  <Button type="submit">Submit</Button>
</form>
```

### Data Table Updates
```tsx
<Table aria-label="Users table">
  <TableHeader>...</TableHeader>
  <TableBody>
    {users.map(user => <TableRow key={user.id}>...</TableRow>)}
  </TableBody>
</Table>
{isLoading && <DataTableStatus message="Loading users..." />}
{users && <DataTableStatus message={`Showing ${users.length} users`} />}
```

### Programmatic Announcements
```tsx
const handleDelete = async () => {
  try {
    await deleteUser(id);
    a11y.announce("User deleted successfully");
  } catch (error) {
    a11y.announce("Error deleting user", "assertive");
  }
};
```

### Loading States

#### Button with Loading State
```tsx
<Button aria-busy={isLoading}>
  {isLoading ? "Saving..." : "Save"}
</Button>
```

#### Container with Loading State
```tsx
import { LoadingContainer } from "@/components/ui/loading-container";

<LoadingContainer isLoading={isLoading} loadingMessage="Loading users...">
  {users.map(user => <UserCard key={user.id} user={user} />)}
</LoadingContainer>
```

#### Data Table with Loading
```tsx
<Table aria-label="Users table" aria-busy={isLoading}>
  <TableHeader>...</TableHeader>
  <TableBody>
    {users.map(user => <TableRow key={user.id}>...</TableRow>)}
  </TableBody>
</Table>
<DataTableStatus 
  message={isLoading ? "Loading users..." : `Showing ${users.length} users`}
  isLoading={isLoading}
/>```
