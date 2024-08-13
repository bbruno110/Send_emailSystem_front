'use client'
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axiosInstance from '@/instance/axiosInstance';

const Email: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<{ value: number; label: string; conteudo: string } | null>(null);
    const [emailOptions, setEmailOptions] = useState<{ value: string; label: string }[]>([]);
    const [perfilOptions, setPerfilOptions] = useState<{ value: number; label: string; conteudo: string }[]>([]);
    const [loading, setLoading] = useState(false); // Estado de carregamento

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedEmails = sessionStorage.getItem('selectedEmails');
            if (storedEmails) {
                const emails = JSON.parse(storedEmails);
                setSelectedEmails(emails);
            }
        }
    }, []);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axiosInstance.get('/list');
                const emailData = response.data.map((item: { id: number, ds_nome: string }) => ({
                    value: item.id,
                    label: item.ds_nome ,
                }));
                setEmailOptions(emailData);
            } catch (error) {
                console.error('Erro ao buscar emails:', error);
            }
        };

        fetchEmails();
    }, []);

    useEffect(() => {
        const fetchPerfis = async () => {
            try {
                const response = await axiosInstance.get('/list-perfil');
                const perfilData = response.data.map((item: { id: number; nm_titulo: string; ds_conteudo: string }) => ({
                    value: item.id,
                    label: item.nm_titulo,
                    conteudo: item.ds_conteudo,
                }));
                setPerfilOptions(perfilData);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        };

        fetchPerfis();
    }, []);

    const handleSelectChange = (newValue: any) => {
        setSelectedEmails(newValue.map((option: any) => option.value));
    };

    const handleProfileChange = (selectedOption: any) => {
        setSelectedProfile(selectedOption);
        if (selectedOption) {
            setBody(selectedOption.conteudo);
            setSubject(selectedOption.label);
        } else {
            setBody('');
            setSubject('');
        }
    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
    };

    const handleClearClick = () => {
        setSelectedEmails([]); // Limpar destinatários
        setSubject(''); // Limpar assunto
        setBody(''); // Limpar corpo do email
        setSelectedProfile(null); // Limpar perfil selecionado
        sessionStorage.clear();
    };

    const handleSendClick = async () => {
        if (selectedEmails.length === 0 || !subject.trim() || !body.trim()) {
            alert('Por favor, preencha todos os campos antes de enviar o email.');
            return;
        }

        const emailData = {
            destinatarios: selectedEmails,
            assunto: subject,
            corpo: body,
            perfilId: selectedProfile ? selectedProfile.value : undefined,
        };

        setLoading(true); // Inicia o carregamento

        try {
            await axiosInstance.post('/sendmail', emailData);
            alert('E-mail enviado com sucesso!');
            handleClearClick(); // Limpa os campos após o envio
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            alert('Erro ao enviar e-mail. Por favor, tente novamente.');
        } finally {
            setLoading(false); // Termina o carregamento
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Enviar Email</h1>

            <div className="mb-4">
                <label className="block mb-2">Destinatários:</label>
                <Select
                    options={emailOptions}
                    value={emailOptions.filter(email => selectedEmails.includes(email.value))}
                    onChange={handleSelectChange}
                    isMulti
                    placeholder='Emails a serem enviados'
                    isDisabled={loading} // Desabilita quando carregando
                />
            </div>

            <div className="flex mb-4">
                <div className="w-1/2">
                    <label className="block mb-2">Assunto:</label>
                    <input
                        type="text"
                        value={subject}
                        placeholder='Assunto do email a ser enviado'
                        onChange={handleSubjectChange}
                        className="w-full p-2 border rounded"
                        disabled={loading} // Desabilita quando carregando
                    />
                </div>
                <div className="w-1/2 ml-4">
                    <label className="block mb-2">Perfil de Email:</label>
                    <Select
                        options={perfilOptions}
                        value={selectedProfile}
                        onChange={handleProfileChange}
                        isClearable
                        placeholder="Mensagens salvas(pré carregadas)"
                        isDisabled={loading} // Desabilita quando carregando
                    />
                </div>
            </div>

            <label className="block mt-4 mb-2">Conteúdo do Email:</label>
            <textarea
                value={body}
                onChange={handleBodyChange}
                rows={6}
                className="w-full p-2 border rounded"
                placeholder={`Aqui poderá digitar o conteúdo da mensagem de email, que serão lidas pelos destinatários. \nUse macros: @nome@, @cnpj@, @cpf@, @email@, @dtcadastro@, @tel1@, @tel2@, @status@, @processo@`}
                disabled={loading} // Desabilita quando carregando
            />

            <div className="mt-4 flex space-x-2">
                <button
                    onClick={handleClearClick}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    disabled={loading} // Desabilita quando carregando
                >
                    Limpar
                </button>
                <button
                    onClick={handleSendClick}
                    className="ml-auto px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={loading} // Desabilita quando carregando
                >
                    {loading ? 'Enviando...' : 'Enviar'} {/* Exibe texto diferente quando carregando */}
                </button>
            </div>
        </div>
    );
};

export default Email;
