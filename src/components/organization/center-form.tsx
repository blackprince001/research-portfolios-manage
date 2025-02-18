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
import { OrganizationCenter } from '@/types';

const centerSchema = z.object({
    center_name: z.string().min(1, 'Center name is required'),
    location: z.string().min(1, 'Location is required'),
});

interface CenterFormProps {
    center?: OrganizationCenter;
    onSubmit: (data: z.infer<typeof centerSchema>) => Promise<void>;
    onCancel: () => void;
}

export function CenterForm({ center, onSubmit, onCancel }: CenterFormProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof centerSchema>>({
        resolver: zodResolver(centerSchema),
        defaultValues: {
            center_name: center?.center_name || '',
            location: center?.location || '',
        },
    });

    const handleSubmit = async (data: z.infer<typeof centerSchema>) => {
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
                    name="center_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Center Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter center name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter location" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : center ? 'Update' : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}