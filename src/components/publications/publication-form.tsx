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
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/utils/supabase-client';

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
  is_org: z.boolean(),
  poster: z.string().url().optional().or(z.literal('')),
  paper_summary: z.string().url().optional().or(z.literal('')), // Add paper_summary field
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
  const [uploading, setUploading] = useState(false);
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
      is_org: publication?.is_org || false,
      poster: publication?.poster || '',
      paper_summary: publication?.paper_summary || '', // Add default value
    },
  });

  const publicationType = form.watch('publication_type');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('posters')
      .upload(filePath, file);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } else {
      const { data } = supabase.storage
        .from('posters')
        .getPublicUrl(filePath);

      form.setValue('poster', data.publicUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    }

    setUploading(false);
  };

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
                  <SelectItem value="research_report">Research Report</SelectItem>
                  <SelectItem value="policy_brief">Policy Briefs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_org"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Is Organization</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poster</FormLabel>
              <FormControl>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {field.value && (
                    <img
                      src={field.value || "/placeholder.svg"}
                      alt="Poster"
                      className="mt-2 h-32 w-32 object-cover"
                    />
                  )}
                </div>
              </FormControl>
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

        <FormField
          control={form.control}
          name="paper_summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paper Summary (SoundCloud URL)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://soundcloud.com/your-audio-summary"
                />
              </FormControl>
              <FormMessage />
              {field.value && (
                <div className="mt-2">
                  <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(field.value)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                  ></iframe>
                </div>
              )}
            </FormItem>
          )}
        />

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