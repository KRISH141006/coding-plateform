export function DifficultyBadge({ difficulty }) {
  const d = difficulty?.toLowerCase();
  return (
    <span className={`badge badge-${d}`}>
      {difficulty}
    </span>
  );
}

export function TagChip({ tag }) {
  return <span className="tag">{tag}</span>;
}

export function TagList({ tags = [] }) {
  const parsed = typeof tags === 'string'
    ? tags.split(',').map(t => t.trim()).filter(Boolean)
    : tags;

  return (
    <div className="tags-wrap">
      {parsed.map(tag => <TagChip key={tag} tag={tag} />)}
    </div>
  );
}
