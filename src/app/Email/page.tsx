'use client'
// src/app/Email/page.tsx

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { data } from '@/helpers/data'; // Import data

const Email: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedEmails = sessionStorage.getItem('selectedEmails');
            if (storedEmails) {
                const emails = JSON.parse(storedEmails);
                setSelectedEmails(emails);
            }
        }
    }, []);

    const initialSelectedValues = selectedEmails.map((email) => ({ value: email, label: email }));
    const options = data.map((item) => ({
        value: item.email,
        label: item.email,
    }));

    const [selectedValues, setSelectedValues] = useState(initialSelectedValues);

    useEffect(() => {
        setSelectedValues(initialSelectedValues);
    }, [selectedEmails]);

    const handleSelectChange = (newValue: any) => {
        setSelectedValues(newValue);
    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
    };

    const handleClearClick = () => {
        setSelectedValues([]); // Clear recipients
        setSubject(''); // Clear subject
        setBody(''); // Clear email body
        sessionStorage.clear();
    };

    const handleSendClick = () => {
        // Implement your send email logic here
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Enviar Email</h1>
            <label className="block mb-2">Destinatários:</label>
            <Select
                options={options}
                value={selectedValues}
                onChange={handleSelectChange}
                isMulti
            />
            <label className="block mt-4 mb-2">Assunto:</label>
            <input
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                className="w-full p-2 border rounded"
            />
            <label className="block mt-4 mb-2">Corpo do Email:</label>
            <textarea
                value={body}
                onChange={handleBodyChange}
                rows={6}
                className="w-full p-2 border rounded"
            />
            <button
                onClick={handleClearClick}
                className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
                Limpar
            </button>
            <button
                onClick={handleSendClick}
                className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Enviar
            </button>
        </div>
    );
};

export default Email;
