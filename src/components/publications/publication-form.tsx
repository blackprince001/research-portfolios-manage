import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Publication } from '@/types';

const publicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  authors: z.string().min(1, 'Authors are required'),
  publication_type: z.string().min(1, 'Publication type is required'),
  journal: z.string().optional(),
  conference: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear()),
  doi: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  pdf_link: z.string().url().optional().or(z.literal('')),
});

interface PublicationFormProps {
  publication?: Publication;
  onSubmit: (data: z.infer<typeof publicationSchema>) => Promise<void>;
  onCancel: () => void;
}

export function PublicationForm({
  publication,
  onSubmit,
  onCancel,
}: PublicationFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof publicationSchema>>({
    resolver: zodResolver(publicationSchema),
    defaultValues: publication || {
      title: '',
      abstract: '',
      authors: '',
      publication_type: '',
      year: new Date().getFullYear(),
    },
  });

  const handleSubmit = async (data: z.infer<typeof publicationSchema>) => {
    setLoading(true);
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: `Publication ${publication ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${publication ? 'update' : 'create'} publication`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Separate authors with commas" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publication_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="journal">Journal Article</SelectItem>
                  <SelectItem value="conference">Conference Paper</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="chapter">Book Chapter</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : publication ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}