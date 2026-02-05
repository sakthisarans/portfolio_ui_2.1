"use client";
import { useState, useEffect, useRef } from "react";
import { upsertKnowledge, uploadDocument, extractKnowledge, getKnowledge } from "@/utils/api";
import { toast } from "react-toastify";

export default function KnowledgeManager() {
    const [docType, setDocType] = useState("url");
    const [docLocation, setDocLocation] = useState("");
    const [prompts, setPrompts] = useState([""]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [training, setTraining] = useState(false);
    const [knowledgeList, setKnowledgeList] = useState([]);
    const [loadingKnowledge, setLoadingKnowledge] = useState(true);

    // Ref to prevent duplicate API calls in React Strict Mode
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Only load once, even in React Strict Mode (development double-mount)
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            loadKnowledge();
        }
    }, []);

    const loadKnowledge = async () => {
        try {
            const data = await getKnowledge();
            setKnowledgeList(data || []);
        } catch (error) {
            console.error("Failed to load knowledge:", error);
            setKnowledgeList([]);
        } finally {
            setLoadingKnowledge(false);
        }
    };

    const addPrompt = () => {
        setPrompts([...prompts, ""]);
    };

    const updatePrompt = (index, value) => {
        const newPrompts = [...prompts];
        newPrompts[index] = value;
        setPrompts(newPrompts);
    };

    const removePrompt = (index) => {
        setPrompts(prompts.filter((_, i) => i !== index));
    };

    const handleSubmitKnowledge = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const knowledgeData = {
                docParams: {
                    docType,
                    docLocation,
                    pageLimit: 500,
                    depth_limit: 2,
                    rate_limit: 2,
                    different_domain_depth: 0,
                },
                prompts: prompts.filter(p => p.trim() !== ""),
            };

            await upsertKnowledge(knowledgeData);
            toast.success("Knowledge base updated successfully!");

            // Reset form
            setDocLocation("");
            setPrompts([""]);

            // Reload knowledge list
            loadKnowledge();
        } catch (error) {
            toast.error("Failed to update knowledge base");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        setLoading(true);
        try {
            await uploadDocument(file);
            toast.success("Document uploaded successfully!");
            setFile(null);
        } catch (error) {
            toast.error("Failed to upload document");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartTraining = async () => {
        setTraining(true);
        try {
            await extractKnowledge();
            toast.success("Training started successfully! This may take a few minutes.");
        } catch (error) {
            toast.error("Failed to start training");
            console.error(error);
        } finally {
            setTraining(false);
        }
    };

    return (
        <div className="editor-container">
            {/* Existing Knowledge List Section */}
            <div className="editor-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Existing Knowledge Entries</h3>
                    <button
                        className="btn-save"
                        onClick={handleStartTraining}
                        disabled={training || knowledgeList.length === 0}
                        style={{
                            background: (training || knowledgeList.length === 0) ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            marginTop: 0,
                            fontSize: '0.875rem',
                            padding: '0.5rem 1rem',
                            cursor: (training || knowledgeList.length === 0) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {training ? "Training..." : "🎯 Start Training"}
                    </button>
                </div>

                {loadingKnowledge ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        Loading knowledge entries...
                    </div>
                ) : knowledgeList.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>
                        No knowledge entries found. Add your first knowledge entry below.
                    </div>
                ) : (
                    <div className="dynamic-list">
                        {knowledgeList.map((item, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="dynamic-item-header">
                                    <h4>{item.docParams?.docType || 'Document'} - {item.docParams?.docLocation || 'Unknown'}</h4>
                                    <button
                                        className="btn-save"
                                        onClick={handleStartTraining}
                                        disabled={training}
                                        style={{
                                            background: training ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            marginTop: 0,
                                            fontSize: '0.875rem',
                                            padding: '0.5rem 1rem',
                                            cursor: training ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {training ? "Training..." : "▶ Start"}
                                    </button>
                                </div>
                                <div className="editor-grid">
                                    <div className="form-group">
                                        <label>Document ID</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={item.docId || 'N/A'}
                                            disabled
                                            style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={item.docParams?.docType || ''}
                                            disabled
                                            style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={item.docParams?.docLocation || ''}
                                        disabled
                                        style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                                    />
                                </div>
                                {item.prompts && item.prompts.length > 0 && (
                                    <div className="form-group">
                                        <label>Prompts ({item.prompts.length})</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {item.prompts.map((prompt, pIndex) => (
                                                <div
                                                    key={pIndex}
                                                    style={{
                                                        background: '#e0e7ff',
                                                        color: '#4338ca',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    {prompt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* URL/Web Knowledge Section */}
            <div className="editor-section">
                <h3>Add Knowledge from URL</h3>
                <form onSubmit={handleSubmitKnowledge}>
                    <div className="form-group">
                        <label>Document Type</label>
                        <select
                            className="form-input"
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                        >
                            <option value="url">URL/Website</option>
                            <option value="pdf">PDF URL</option>
                            <option value="text">Text</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Document Location (URL)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={docLocation}
                            onChange={(e) => setDocLocation(e.target.value)}
                            placeholder="https://example.com/documentation"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Training Prompts</label>
                        <div className="dynamic-list">
                            {prompts.map((prompt, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={prompt}
                                        onChange={(e) => updatePrompt(index, e.target.value)}
                                        placeholder="Enter a prompt for training"
                                    />
                                    {prompts.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-remove"
                                            onClick={() => removePrompt(index)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn-add"
                            onClick={addPrompt}
                        >
                            + Add Prompt
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn-save"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Add to Knowledge Base"}
                    </button>
                </form>
            </div>

            {/* File Upload Section */}
            <div className="editor-section">
                <h3>Upload Document</h3>
                <form onSubmit={handleFileUpload}>
                    <div className="form-group">
                        <label>Select File (PDF, TXT, etc.)</label>
                        <input
                            type="file"
                            className="form-input"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept=".pdf,.txt,.doc,.docx"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-save"
                        disabled={loading || !file}
                    >
                        {loading ? "Uploading..." : "Upload Document"}
                    </button>
                </form>
            </div>

            {/* Information Section */}
            <div className="editor-section">
                <h3>ℹ️ About Knowledge Base</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    The knowledge base powers your private LLM. You can add knowledge from:
                </p>
                <ul style={{ color: '#6b7280', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                    <li><strong>URLs:</strong> Crawl and extract content from websites</li>
                    <li><strong>Documents:</strong> Upload PDF, TXT, or other document files</li>
                    <li><strong>Training Prompts:</strong> Define how the AI should understand and use the content</li>
                </ul>
                <p style={{ color: '#6b7280', lineHeight: '1.6', marginTop: '1rem' }}>
                    Once added, click the "Start Training" button to process the knowledge and make it available to your AI assistant in the chat interface.
                </p>
            </div>
        </div>
    );
}
