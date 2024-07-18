'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosInstance from '@/instance/axiosInstance'; // Ajuste o caminho conforme necessário

const Perfil: React.FC = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<any>(null); // Definir o tipo do estado
    const [emailProfiles, setEmailProfiles] = useState<any[]>([]); // Estado para perfis de email
    const [isLoading, setIsLoading] = useState(false); // Estado para controle de carregamento
    const [hasError, setHasError] = useState(false); // Estado para controle de erros

    // Função para buscar perfis da API
    const fetchPerfis = async () => {
        try {
            const response = await axiosInstance.get('/list-perfil');
            const profiles = response.data.map((item: any) => ({
                value: item.id,
                label: item.nm_titulo,
                conteudo: item.ds_conteudo,
            }));
            setEmailProfiles(profiles);
        } catch (error) {
            console.error('Erro ao buscar perfis:', error);
        }
    };

    // Carregar os perfis quando o componente for montado
    useEffect(() => {
        fetchPerfis();
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBody(event.target.value);
    };

    const handleProfileChange = (selectedOption: any) => {
        setSelectedProfile(selectedOption);
        if (selectedOption) {
            setBody(selectedOption.conteudo);
            setTitle(selectedOption.label);
        } else {
            setBody('');
            setTitle('');
        }
    };

    const handleSaveClick = async () => {
        if (!title.trim()) {
            alert('O título não pode estar vazio.');
            return;
        }
        if (!body.trim()) {
            alert('O corpo do email não pode estar vazio.');
            return;
        }

        setIsLoading(true);
        setHasError(false);

        try {
            await axiosInstance.post('/create-perfil', { nm_titulo: title, ds_conteudo: body });
            alert('Perfil salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            setHasError(true);
            alert('Erro ao salvar perfil. Por favor, tente novamente.');
        } finally {
            // Limpar campos e restaurar estado
            setTitle('');
            setBody('');
            setSelectedProfile(null);
            setIsLoading(false);
            fetchPerfis();
        }
    };

    const handleEditClick = async () => {
        if (!title.trim()) {
            alert('O título não pode estar vazio.');
            return;
        }
        if (!body.trim()) {
            alert('O corpo do email não pode estar vazio.');
            return;
        }

        if (!selectedProfile?.value) {
            alert('Nenhum perfil selecionado para editar.');
            return;
        }

        setIsLoading(true);
        setHasError(false);

        try {
            await axiosInstance.put(`/update-perfil/${selectedProfile.value}`, { nm_titulo: title, ds_conteudo: body });
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setHasError(true);
            alert('Erro ao atualizar perfil. Por favor, tente novamente.');
        } finally {
            // Limpar campos e restaurar estado
            setTitle('');
            setBody('');
            setSelectedProfile(null);
            setIsLoading(false);
            fetchPerfis();
        }
    };

    const handleCancelClick = () => {
        setTitle('');
        setBody('');
        setSelectedProfile(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Email Composição</h1>
            
            <label className="block mb-2">Perfis:</label>
            <Select
                value={selectedProfile}
                options={emailProfiles}
                onChange={handleProfileChange}
                isClearable
                isDisabled={isLoading}
            />
            
            <label className="block mt-4 mb-2">Título:</label>
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full p-2 border rounded"
                disabled={isLoading}
            />

            <label className="block mt-4 mb-2">Corpo do Email:</label>
            <textarea
                value={body}
                onChange={handleBodyChange}
                rows={6}
                className="w-full p-2 border rounded"
                placeholder="Use macros: @nome@, @cnpj@, @email@, @cadastro@, @tel1@, @tel2@"
                disabled={isLoading}
            />

            <div className="mt-4 flex space-x-2">
                {selectedProfile ? (
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Atualizando...' : 'Editar'}
                    </button>
                ) : (
                    <button
                        onClick={handleSaveClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Salvar'}
                    </button>
                )}
                <button
                    onClick={handleCancelClick}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default Perfil;
