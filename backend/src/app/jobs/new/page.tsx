'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function NewJobPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        url: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/jobs', {
            method: 'POST',
            body: JSON.stringify({
                ...form,
                scam_probability: null,
                flagged: null,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            router.push('/jobs');
        } else {
            alert('Error creating job');
        }
    };

    return (
        <div className="bg-black text-white min-h-screen py-10 px-4 flex justify-center">
            <Card className="bg-[#1d2226] w-full max-w-2xl border-none text-white">
                <CardHeader>
                    <h1 className="text-xl font-semibold">Post a New Job</h1>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {['title', 'company', 'location', 'url'].map(field => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                value={(form as any)[field]}
                                onChange={handleChange}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                className="w-full p-2 rounded bg-[#2c3136] border border-gray-700 text-white placeholder-gray-400"
                                required
                            />
                        ))}

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Job description"
                            className="w-full p-2 rounded bg-[#2c3136] border border-gray-700 text-white placeholder-gray-400"
                            rows={5}
                            required
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
