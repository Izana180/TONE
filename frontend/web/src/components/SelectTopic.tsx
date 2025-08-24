import { useState, memo } from 'react';
import { Topic } from "../types/Topic"

interface SelectTopicProps {
    onTopicChange: (topic: Topic | null) => void;
}

const SelectTopic = memo(({ onTopicChange }: SelectTopicProps) => {
    const [topics, setTopics] = useState<Topic[]>([
        { id: "1", name: "仕事" },
        { id: "2", name: "プライベート" },
        { id: "3", name: "その他" }
    ]);
    
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newTopicName, setNewTopicName] = useState<string>('');

    // 共通のトピック選択処理
    const selectTopic = (topicId: string) => {
        setSelectedTopicId(topicId);
        const selectedTopic = topics.find(topic => topic.id === topicId);
        onTopicChange(selectedTopic || null);
    };

    const handleAddTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopicName.trim()) return;

        const newTopic: Topic = {
            id: Date.now().toString(), 
            name: newTopicName.trim()
        };

        setTopics(prev => [...prev, newTopic]);
        setIsModalOpen(false);
        setNewTopicName('');
        
        selectTopic(newTopic.id);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        
        if (value === 'add-new') {
            setIsModalOpen(true);
            e.target.value = selectedTopicId;
        } else {
            selectTopic(value);
        }
    };

    return (
        <div className="select-topic">
            <div className="mb-3">
                <select
                    id="topicFilter"
                    className="form-select"
                    value={selectedTopicId}
                    onChange={handleSelectChange} 
                >
                    <option value="">トピック選択</option>
                    {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                            {topic.name}
                        </option>
                    ))}
                    <option value="add-new" style={{ fontWeight: 'bold', color: '#0066cc' }}>
                        + 新しいトピックを追加
                    </option>
                </select>
            </div>

            {/* モーダル */}
            {isModalOpen && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">新しいトピックを追加</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                    aria-label="閉じる"
                                />
                            </div>
                            <form onSubmit={handleAddTopic}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="topicName" className="form-label">
                                            トピック名
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="topicName"
                                            value={newTopicName}
                                            onChange={(e) => setNewTopicName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!newTopicName.trim()}
                                    >
                                        追加
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

SelectTopic.displayName = 'SelectTopic';

export default SelectTopic;