"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { updatePortfolio, getPortfolioRaw } from "@/utils/api";
import { toast } from "react-toastify";

export default function PortfolioEditor({ domain }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [portfolio, setPortfolio] = useState(null);
    const loadedDomainRef = useRef(null);

    // State for showing/hiding sensitive fields
    const [showGithubToken, setShowGithubToken] = useState(false);
    const [showBlogAdminKey, setShowBlogAdminKey] = useState(false);
    const [showBlogContentKey, setShowBlogContentKey] = useState(false);

    useEffect(() => {
        // Only load if domain exists and hasn't been loaded yet
        if (domain && loadedDomainRef.current !== domain) {
            loadedDomainRef.current = domain;
            loadPortfolio();
        }
    }, [domain, loadPortfolio]);

    const loadPortfolio = useCallback(async () => {
        try {
            const data = await getPortfolioRaw(domain);
            setPortfolio(data);
        } catch (error) {
            // If API returns 404 or fails, initialize with empty template
            console.warn("Portfolio data not found, initializing with empty template:", error);
            setPortfolio(getEmptyPortfolioTemplate());
            toast.info("No existing portfolio found. Starting with empty template.");
        } finally {
            setLoading(false);
        }
    }, [domain]);

    const getEmptyPortfolioTemplate = () => ({
        personalData: {
            name: "",
            profile: "",
            designation: "",
            description: "",
            email: "",
            phone: "",
            address: "",
            github: "",
            linkedIn: "",
            resume: "",
            devUsername: ""
        },
        contact: {
            email: "",
            phone: "",
            address: "",
            github: "",
            linkedIn: ""
        },
        skillsData: [],
        experiences: [],
        educations: [],
        projectsData: [],
        // GitHub config - backend will fetch repos using these credentials
        github: {
            userid: "",
            token: "",
            defaultUrl: null
        },
        // Blog config - backend will fetch posts from this Ghost instance
        blog: {
            url: "",
            admin_key: "",
            key: ""
        }
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePortfolio(portfolio);
            toast.success("Portfolio updated successfully!");
        } catch (error) {
            toast.error("Failed to update portfolio");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section, field, value) => {
        setPortfolio({
            ...portfolio,
            [section]: {
                ...portfolio[section],
                [field]: value,
            },
        });
    };

    const updateArrayField = (section, index, field, value) => {
        const newArray = [...portfolio[section]];
        newArray[index] = {
            ...newArray[index],
            [field]: value,
        };
        setPortfolio({
            ...portfolio,
            [section]: newArray,
        });
    };

    const addArrayItem = (section, template) => {
        setPortfolio({
            ...portfolio,
            [section]: [...portfolio[section], template],
        });
    };

    const removeArrayItem = (section, index) => {
        setPortfolio({
            ...portfolio,
            [section]: portfolio[section].filter((_, i) => i !== index),
        });
    };

    const moveArrayItem = (section, index, direction) => {
        const newArray = [...portfolio[section]];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newArray.length) return;

        [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]];

        setPortfolio({
            ...portfolio,
            [section]: newArray,
        });
    };

    const addSkill = (skill) => {
        if (skill && !portfolio.skillsData.includes(skill)) {
            setPortfolio({
                ...portfolio,
                skillsData: [...portfolio.skillsData, skill],
            });
        }
    };

    const removeSkill = (index) => {
        setPortfolio({
            ...portfolio,
            skillsData: portfolio.skillsData.filter((_, i) => i !== index),
        });
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: '#1f2937' }}>Loading portfolio data...</div>;
    }

    if (!portfolio) {
        return <div style={{ padding: '2rem', color: '#ef4444' }}>Failed to load portfolio data</div>;
    }

    return (
        <div className="editor-container">
            {/* Personal Data Section */}
            <div className="editor-section">
                <h3>Personal Information</h3>
                <div className="editor-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.name}
                            onChange={(e) => updateField('personalData', 'name', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Designation</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.designation}
                            onChange={(e) => updateField('personalData', 'designation', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Profile</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.profile}
                            onChange={(e) => updateField('personalData', 'profile', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Dev Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.devUsername}
                            onChange={(e) => updateField('personalData', 'devUsername', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={portfolio.personalData.email}
                            onChange={(e) => updateField('personalData', 'email', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.phone}
                            onChange={(e) => updateField('personalData', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>GitHub</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.github}
                            onChange={(e) => updateField('personalData', 'github', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.linkedIn}
                            onChange={(e) => updateField('personalData', 'linkedIn', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Resume URL</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.personalData.resume}
                            onChange={(e) => updateField('personalData', 'resume', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        className="form-input"
                        value={portfolio.personalData.address}
                        onChange={(e) => updateField('personalData', 'address', e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Description</label>
                    <textarea
                        className="form-input"
                        value={portfolio.personalData.description}
                        onChange={(e) => updateField('personalData', 'description', e.target.value)}
                        rows={4}
                    />
                </div>
            </div>

            {/* Contact Section */}
            <div className="editor-section">
                <h3>Contact Information</h3>
                <div className="editor-grid">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={portfolio.contact.email}
                            onChange={(e) => updateField('contact', 'email', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.contact.phone}
                            onChange={(e) => updateField('contact', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>GitHub</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.contact.github}
                            onChange={(e) => updateField('contact', 'github', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.contact.linkedIn}
                            onChange={(e) => updateField('contact', 'linkedIn', e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        className="form-input"
                        value={portfolio.contact.address}
                        onChange={(e) => updateField('contact', 'address', e.target.value)}
                    />
                </div>
            </div>

            {/* Skills Section */}
            <div className="editor-section">
                <h3>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {portfolio.skillsData.map((skill, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#667eea',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span>{skill}</span>
                            <button
                                onClick={() => removeSkill(index)}
                                style={{
                                    background: 'rgba(255,255,255,0.3)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.75rem',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label>Add Skill</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Type skill name and press Enter"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addSkill(e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                </div>
            </div>

            {/* Experience Section */}
            <div className="editor-section">
                <h3>Experience</h3>
                <div className="dynamic-list">
                    {portfolio.experiences.map((exp, index) => (
                        <div key={index} className="dynamic-item">
                            <div className="dynamic-item-header">
                                <h4>Experience #{index + 1}</h4>
                                <div className="header-actions">
                                    <button
                                        className="btn-move"
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem('experiences', index, 'up')}
                                        title="Move Up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="btn-move"
                                        disabled={index === portfolio.experiences.length - 1}
                                        onClick={() => moveArrayItem('experiences', index, 'down')}
                                        title="Move Down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('experiences', index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="editor-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={exp.title}
                                        onChange={(e) => updateArrayField('experiences', index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={exp.company}
                                        onChange={(e) => updateArrayField('experiences', index, 'company', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={exp.duration}
                                        onChange={(e) => updateArrayField('experiences', index, 'duration', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="btn-add"
                    onClick={() => addArrayItem('experiences', {
                        id: portfolio.experiences.length + 1,
                        title: '',
                        company: '',
                        duration: '',
                    })}
                >
                    + Add Experience
                </button>
            </div>

            {/* Education Section */}
            <div className="editor-section">
                <h3>Education</h3>
                <div className="dynamic-list">
                    {portfolio.educations.map((edu, index) => (
                        <div key={index} className="dynamic-item">
                            <div className="dynamic-item-header">
                                <h4>Education #{index + 1}</h4>
                                <div className="header-actions">
                                    <button
                                        className="btn-move"
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem('educations', index, 'up')}
                                        title="Move Up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="btn-move"
                                        disabled={index === portfolio.educations.length - 1}
                                        onClick={() => moveArrayItem('educations', index, 'down')}
                                        title="Move Down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('educations', index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="editor-grid">
                                <div className="form-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={edu.title}
                                        onChange={(e) => updateArrayField('educations', index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Institution</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={edu.institution}
                                        onChange={(e) => updateArrayField('educations', index, 'institution', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={edu.duration}
                                        onChange={(e) => updateArrayField('educations', index, 'duration', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="btn-add"
                    onClick={() => addArrayItem('educations', {
                        id: portfolio.educations.length + 1,
                        title: '',
                        institution: '',
                        duration: '',
                    })}
                >
                    + Add Education
                </button>
            </div>

            {/* Projects Section */}
            <div className="editor-section">
                <h3>Projects</h3>
                <div className="dynamic-list">
                    {portfolio.projectsData.map((project, index) => (
                        <div key={index} className="dynamic-item">
                            <div className="dynamic-item-header">
                                <h4>{project.name || `Project #${index + 1}`}</h4>
                                <div className="header-actions">
                                    <button
                                        className="btn-move"
                                        disabled={index === 0}
                                        onClick={() => moveArrayItem('projectsData', index, 'up')}
                                        title="Move Up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="btn-move"
                                        disabled={index === portfolio.projectsData.length - 1}
                                        onClick={() => moveArrayItem('projectsData', index, 'down')}
                                        title="Move Down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => removeArrayItem('projectsData', index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={project.name}
                                    onChange={(e) => updateArrayField('projectsData', index, 'name', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    value={project.description}
                                    onChange={(e) => updateArrayField('projectsData', index, 'description', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="editor-grid">
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={project.role}
                                        onChange={(e) => updateArrayField('projectsData', index, 'role', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Code URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={project.code || ''}
                                        onChange={(e) => updateArrayField('projectsData', index, 'code', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Demo URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={project.demo || ''}
                                        onChange={(e) => updateArrayField('projectsData', index, 'demo', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tools (comma-separated)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={project.tools.join(', ')}
                                    onChange={(e) => updateArrayField('projectsData', index, 'tools', e.target.value.split(',').map(t => t.trim()))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="btn-add"
                    onClick={() => addArrayItem('projectsData', {
                        id: portfolio.projectsData.length + 1,
                        name: '',
                        description: '',
                        tools: [],
                        role: '',
                        code: '',
                        demo: '',
                    })}
                >
                    + Add Project
                </button>
            </div>

            {/* GitHub Configuration Section */}
            <div className="editor-section">
                <h3>GitHub Configuration</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Configure GitHub credentials to fetch and display your repositories
                </p>
                <div className="editor-grid">
                    <div className="form-group">
                        <label>GitHub User ID</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.github.userid}
                            onChange={(e) => updateField('github', 'userid', e.target.value)}
                            placeholder="e.g., sakthisarans"
                        />
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>GitHub Token</label>
                        <input
                            type={showGithubToken ? "text" : "password"}
                            className="form-input"
                            style={{ paddingRight: '2.5rem' }}
                            value={portfolio.github.token}
                            onChange={(e) => updateField('github', 'token', e.target.value)}
                            placeholder="ghp_..."
                        />
                        <button
                            type="button"
                            onClick={() => setShowGithubToken(!showGithubToken)}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                bottom: '0.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                fontSize: '1.1rem',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title={showGithubToken ? "Hide token" : "Show token"}
                        >
                            {showGithubToken ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label>Default URL (Optional)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={portfolio.github.defaultUrl || ''}
                        onChange={(e) => updateField('github', 'defaultUrl', e.target.value)}
                        placeholder="https://github.com/username"
                    />
                </div>
            </div>

            {/* Blog Configuration Section */}
            <div className="editor-section">
                <h3>Blog Configuration</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Configure Ghost blog credentials to fetch and display your blog posts
                </p>
                <div className="editor-grid">
                    <div className="form-group">
                        <label>Blog URL</label>
                        <input
                            type="text"
                            className="form-input"
                            value={portfolio.blog.url}
                            onChange={(e) => updateField('blog', 'url', e.target.value)}
                            placeholder="https://yourblog.com"
                        />
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Admin Key</label>
                        <input
                            type={showBlogAdminKey ? "text" : "password"}
                            className="form-input"
                            style={{ paddingRight: '2.5rem' }}
                            value={portfolio.blog.admin_key}
                            onChange={(e) => updateField('blog', 'admin_key', e.target.value)}
                            placeholder="Admin API key"
                        />
                        <button
                            type="button"
                            onClick={() => setShowBlogAdminKey(!showBlogAdminKey)}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                bottom: '0.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                fontSize: '1.1rem',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title={showBlogAdminKey ? "Hide key" : "Show key"}
                        >
                            {showBlogAdminKey ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Content API Key</label>
                        <input
                            type={showBlogContentKey ? "text" : "password"}
                            className="form-input"
                            style={{ paddingRight: '2.5rem' }}
                            value={portfolio.blog.key}
                            onChange={(e) => updateField('blog', 'key', e.target.value)}
                            placeholder="Content API key"
                        />
                        <button
                            type="button"
                            onClick={() => setShowBlogContentKey(!showBlogContentKey)}
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                bottom: '0.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                fontSize: '1.1rem',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                            title={showBlogContentKey ? "Hide key" : "Show key"}
                        >
                            {showBlogContentKey ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                </div>
            </div>

            <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Portfolio'}
            </button>
        </div>
    );
}
