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
import { OrganizationPartner } from '@/types';
import { supabase } from '@/utils/supabase-client';
import { useToast } from '@/hooks/use-toast';

const partnerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    socials: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one social link is required'),
    logo_url: z.string().url('Must be a valid URL'),
});

interface PartnerFormProps {
    partner?: OrganizationPartner;
    onSubmit: (data: z.infer<typeof partnerSchema>) => Promise<void>;
    onCancel: () => void;
}

export function PartnerForm({ partner, onSubmit, onCancel }: PartnerFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof partnerSchema>>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            name: partner?.name || '',
            socials: partner?.socials || [''],
            logo_url: partner?.logo_url || '',
        },
    });

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('logos')
            .upload(filePath, file);

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload logo',
                variant: 'destructive',
            });
        } else {
            const { data } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);

            form.setValue('logo_url', data.publicUrl);
            toast({
                title: 'Success',
                description: 'Logo uploaded successfully',
            });
        }

        setUploading(false);
    };

    const addSocial = () => {
        const currentSocials = form.getValues('socials');
        form.setValue('socials', [...currentSocials, '']);
    };

    const handleSubmit = async (data: z.infer<typeof partnerSchema>) => {
        setLoading(true);
        try {
            await onSubmit(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Partner Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter partner name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                    />
                                    {field.value && (
                                        <img
                                            src={field.value || "/placeholder.svg"}
                                            alt="Logo"
                                            className="mt-2 h-32 w-32 object-contain"
                                        />
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Social Links</FormLabel>
                        <Button type="button" variant="outline" onClick={addSocial}>
                            Add Social Link
                        </Button>
                    </div>
                    {form.watch('socials').map((_, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={`socials.${index}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type="url" placeholder="Enter social media URL" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : partner ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}