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
import { PublicationPreview } from './publication-preview';

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
  publication?: Publication | null;
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
    defaultValues: {
      title: publication?.title || '',
      abstract: publication?.abstract || '',
      authors: publication?.authors || '',
      publication_type: publication?.publication_type || '',
      journal: publication?.journal || '',
      conference: publication?.conference || '',
      year: publication?.year || new Date().getFullYear(),
      doi: publication?.doi || '',
      url: publication?.url || '',
      pdf_link: publication?.pdf_link || '',
    },
  });

  const publicationType = form.watch('publication_type');

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
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        {publicationType === 'journal' && (
          <FormField
            control={form.control}
            name="journal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Journal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {publicationType === 'conference' && (
          <FormField
            control={form.control}
            name="conference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conference</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="doi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOI</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 10.1000/xyz123" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pdf_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PDF Link</FormLabel>
                <FormControl>
                  <Input {...field} type="url" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <PublicationPreview data={form.getValues()} />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : publication ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}