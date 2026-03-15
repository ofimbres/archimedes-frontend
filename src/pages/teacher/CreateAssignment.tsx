import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCircleCheck, faClipboardList, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthContext } from '../../contexts/AuthContext';
import {
  getActivitiesTopics,
  getActivities,
  getActivity,
  createAssignment,
  type Activity,
  type ActivityTopicOption,
} from '../../libs/apiEndpoints';

const inputClass =
  'input input-bordered rounded-bubble border-2 border-water-foam w-full focus:border-water-mid focus:outline-none';

/** Resolve activity ID from API (activity_id or id) */
function getActivityId(a: Activity): string {
  return (a.activity_id ?? a.id ?? '').toString();
}

/** Icon and label for activity type; default to Miniquiz when unknown */
function getActivityTypeDisplay(activityType: string | undefined): { icon: typeof faBookOpen; label: string } {
  const t = (activityType ?? '').toLowerCase();
  if (t === 'miniquiz' || t === 'quiz') return { icon: faBookOpen, label: 'Miniquiz' };
  return { icon: faBookOpen, label: activityType || 'Miniquiz' };
}

function useUniqueTopics(options: ActivityTopicOption[]) {
  const topics = Array.from(new Set(options.map((o) => o.topic).filter(Boolean))) as string[];
  return topics.sort();
}

function useSubtopicsForTopic(options: ActivityTopicOption[], topic: string): string[] {
  const seen = new Set<string>();
  for (const o of options) {
    if (o.topic !== topic) continue;
    if (Array.isArray(o.subtopics)) {
      (o.subtopics as string[]).forEach((s) => s && seen.add(s));
    } else if (o.subtopic) {
      seen.add(String(o.subtopic));
    }
  }
  return Array.from(seen).sort();
}

const CreateAssignment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const accessToken = authContext.sessionInfo?.accessToken;
  const courseName = (location.state as { courseName?: string } | null)?.courseName ?? 'Course';

  const teacherId =
    authContext.sessionInfo?.user_type === 'teachers' &&
    authContext.sessionInfo?.profile &&
    'id' in authContext.sessionInfo.profile
      ? (authContext.sessionInfo.profile as { id: string }).id
      : null;

  const [topicOptions, setTopicOptions] = useState<ActivityTopicOption[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityIdInput, setActivityIdInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [titleOverride, setTitleOverride] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activitySearchMode, setActivitySearchMode] = useState<'topic' | 'id'>('topic');

  const uniqueTopics = useUniqueTopics(topicOptions);
  const subtopicsForTopic = useSubtopicsForTopic(topicOptions, selectedTopic);

  useEffect(() => {
    if (!accessToken) {
      setTopicsLoading(false);
      return;
    }
    getActivitiesTopics(accessToken)
      .then(setTopicOptions)
      .catch(() => setTopicOptions([]))
      .finally(() => setTopicsLoading(false));
  }, [accessToken]);

  const searchByTopic = useCallback(() => {
    if (!accessToken) return;
    setSearchLoading(true);
    setActivities([]);
    setSelectedActivity(null);
    getActivities({ topic: selectedTopic || undefined, subtopic: selectedSubtopic || undefined }, accessToken)
      .then((list) => {
        setActivities(list);
        if (list.length === 1) setSelectedActivity(list[0]);
      })
      .catch(() => setActivities([]))
      .finally(() => setSearchLoading(false));
  }, [accessToken, selectedTopic, selectedSubtopic]);

  const lookupById = useCallback(() => {
    const id = activityIdInput.trim();
    if (!id || !accessToken) return;
    setLookupError(null);
    setLookupLoading(true);
    setSelectedActivity(null);
    getActivity(id, accessToken)
      .then((a) => setSelectedActivity(a))
      .catch((err) => {
        setLookupError(err instanceof Error ? err.message : 'Activity not found');
        setSelectedActivity(null);
      })
      .finally(() => setLookupLoading(false));
  }, [accessToken, activityIdInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !teacherId || !accessToken || !selectedActivity) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createAssignment(
        {
          course_id: courseId,
          activity_id: getActivityId(selectedActivity),
          teacher_id: teacherId,
          due_date: dueDate.trim() || undefined,
          title_override: titleOverride.trim() || undefined,
        },
        accessToken
      );
      navigate(`/teacher/courses/${courseId}/roster`, { state: { courseName } });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!courseId) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-error">Missing course.</p>
        <Link to="/teacher/courses" className="btn btn-primary mt-4 rounded-bubble">Back to Manage courses</Link>
      </div>
    );
  }

  if (!teacherId || !accessToken) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-bubble">You must be signed in as a teacher.</div>
        <Link to="/" className="btn btn-primary mt-4 rounded-bubble">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/teacher/courses/${courseId}/roster`}
          state={{ courseName }}
          className="text-water-mid hover:text-water-deep text-sm font-medium"
        >
          ← Back to roster
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-water-deep mb-1">Create assignment</h1>
        <p className="text-water-mid text-sm mb-3">
          Choose an activity for this course, then set optional due date and title.
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-bubble bg-primary/10 text-primary font-medium text-sm border border-primary/20">
          {courseName}
        </span>
      </div>

      <section className="mb-10" aria-labelledby="section-choose-activity">
        <h2 id="section-choose-activity" className="font-display font-semibold text-lg text-water-deep mb-4">
          1. Choose an activity
        </h2>
        <div
          role="tablist"
          aria-label="Choose how to find an activity"
          className="flex flex-row flex-nowrap w-full max-w-md p-1 rounded-blob border-2 border-water-foam bg-water-foam/40 shadow-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activitySearchMode === 'topic'}
            id="tab-topic"
            className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-bubble text-sm font-semibold border-0 cursor-pointer transition-all duration-200 ${
              activitySearchMode === 'topic'
                ? 'bg-primary text-primary-content shadow-md'
                : 'bg-transparent text-water-deep hover:bg-white/60'
            }`}
            onClick={() => setActivitySearchMode('topic')}
          >
            <FontAwesomeIcon icon={faClipboardList} className="text-sm shrink-0" aria-hidden />
            <span>Search by topic</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activitySearchMode === 'id'}
            id="tab-id"
            className={`flex-1 min-w-0 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-bubble text-sm font-semibold border-0 cursor-pointer transition-all duration-200 ${
              activitySearchMode === 'id'
                ? 'bg-primary text-primary-content shadow-md'
                : 'bg-transparent text-water-deep hover:bg-white/60'
            }`}
            onClick={() => setActivitySearchMode('id')}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm shrink-0" aria-hidden />
            <span>Look up by ID</span>
          </button>
        </div>
        <div
          role="tabpanel"
          aria-labelledby={activitySearchMode === 'topic' ? 'tab-topic' : 'tab-id'}
          className="bg-base-100 border-2 border-water-foam/50 border-t-0 rounded-blob rounded-t-none p-6 shadow-bubble -mt-px"
        >
        {activitySearchMode === 'topic' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-bubble bg-water-foam/50 flex items-center justify-center text-water-deep">
              <FontAwesomeIcon icon={faClipboardList} className="text-sm" />
            </span>
            <h3 className="font-display font-semibold text-lg text-water-deep">Search by topic</h3>
          </div>
          {topicsLoading ? (
            <p className="text-base-content/60 text-sm py-4">Loading topics…</p>
          ) : (
            <>
              <label className="block text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">Topic</label>
              <div className="mb-4">
                <select
                  className={inputClass}
                  value={selectedTopic}
                  onChange={(e) => {
                    setSelectedTopic(e.target.value);
                    setSelectedSubtopic('');
                  }}
                  aria-label="Topic"
                >
                  <option value="">All topics</option>
                  {uniqueTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <label className="block text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">Subtopic</label>
              <div className="mb-4">
                <select
                  className={inputClass}
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  aria-label="Subtopic"
                  disabled={!selectedTopic}
                >
                  <option value="">All subtopics</option>
                  {subtopicsForTopic.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-primary rounded-bubble w-full sm:w-auto"
                onClick={searchByTopic}
                disabled={searchLoading}
              >
                {searchLoading ? 'Searching…' : 'Search activities'}
              </button>
              {activities.length > 0 && (
                <div className="mt-5 pt-4 border-t border-base-300/50">
                  <p className="text-base-content/60 text-xs font-medium uppercase tracking-wide mb-3">
                    {activities.length} result{activities.length !== 1 ? 's' : ''} — click to select
                  </p>
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 pb-3" role="list">
                    {activities.map((a, index) => {
                      const isSelected = selectedActivity === a;
                      const typeDisplay = getActivityTypeDisplay(a.activity_type);
                      const activityId = getActivityId(a);
                      return (
                        <div key={activityId || `activity-${index}`} role="listitem">
                          <button
                            type="button"
                            className={`w-full text-left rounded-blob border-2 transition-all duration-200 flex items-center gap-4 p-3.5 ${
                              isSelected
                                ? 'border-primary bg-primary/5 shadow-bubble ring-2 ring-primary/20'
                                : 'border-water-foam/50 bg-base-100 hover:border-water-mid hover:shadow-sm'
                            }`}
                            onClick={() => setSelectedActivity(a)}
                          >
                            <span className={`shrink-0 w-11 h-11 rounded-bubble flex items-center justify-center ${isSelected ? 'bg-primary text-primary-content' : 'bg-water-foam/60 text-water-deep'}`} title={typeDisplay.label}>
                              <FontAwesomeIcon icon={typeDisplay.icon} className="text-xl" />
                            </span>
                            <div className="min-w-0 flex-1 text-left">
                              {a.description ? (
                                <p className="font-display font-bold text-base text-water-deep leading-snug mb-1.5">{a.description}</p>
                              ) : (
                                <p className="font-display font-bold text-base text-water-deep mb-1.5">{activityId}</p>
                              )}
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-1">
                                <span className="badge badge-ghost badge-sm font-mono px-1.5 py-0 border border-base-300/60 text-[10px]">
                                  Code: {activityId}
                                </span>
                                <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-primary/30 text-primary text-[10px]">
                                  Type: {typeDisplay.label}
                                </span>
                                {a.topic && (
                                  <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/70 text-[10px]">
                                    Topic: {a.topic}
                                  </span>
                                )}
                                {a.subtopic && (
                                  <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/60 text-[10px]">
                                    Subtopic: {a.subtopic}
                                  </span>
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <span className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center" aria-label="Selected">
                                <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </>
        )}
        {activitySearchMode === 'id' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-bubble bg-water-foam/50 flex items-center justify-center text-water-deep">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm" />
            </span>
            <h3 className="font-display font-semibold text-lg text-water-deep">Look up by ID</h3>
          </div>
          <label className="block text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">Activity ID</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. abc-123"
              value={activityIdInput}
              onChange={(e) => setActivityIdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookupById()}
            />
            <button
              type="button"
              className="btn btn-outline btn-primary rounded-bubble shrink-0"
              onClick={lookupById}
              disabled={!activityIdInput.trim() || lookupLoading}
            >
              {lookupLoading ? 'Loading…' : 'Fetch'}
            </button>
          </div>
          {lookupError && (
            <div className="alert alert-warning rounded-bubble text-sm mb-3">{lookupError}</div>
          )}
          {selectedActivity && lookupLoading === false && activityIdInput.trim() && (
            <div className="mt-4 rounded-blob border-2 border-water-foam/50 bg-base-100 flex items-start gap-4 p-3.5">
              <span className="shrink-0 w-11 h-11 rounded-bubble flex items-center justify-center bg-water-foam/60 text-water-deep" title={getActivityTypeDisplay(selectedActivity.activity_type).label}>
                <FontAwesomeIcon icon={getActivityTypeDisplay(selectedActivity.activity_type).icon} className="text-xl" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                {selectedActivity.description ? (
                  <p className="font-display font-bold text-base text-water-deep leading-snug mb-1.5">{selectedActivity.description}</p>
                ) : (
                  <p className="font-display font-bold text-base text-water-deep mb-1.5">{getActivityId(selectedActivity)}</p>
                )}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-1">
                  <span className="badge badge-ghost badge-sm font-mono px-1.5 py-0 border border-base-300/60 text-[10px]">
                    Code: {getActivityId(selectedActivity)}
                  </span>
                  <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-primary/30 text-primary text-[10px]">
                    Type: {getActivityTypeDisplay(selectedActivity.activity_type).label}
                  </span>
                  {selectedActivity.topic && (
                    <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/70 text-[10px]">
                      Topic: {selectedActivity.topic}
                    </span>
                  )}
                  {selectedActivity.subtopic && (
                    <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/60 text-[10px]">
                      Subtopic: {selectedActivity.subtopic}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
        )}
        </div>
      </section>

      {selectedActivity && (
        <section className="pt-8 border-t-2 border-water-foam/40" aria-labelledby="section-assignment-details">
          <h2 id="section-assignment-details" className="font-display font-semibold text-lg text-water-deep mb-4">
            2. Set assignment details
          </h2>
          <div className="rounded-blob border-2 border-primary/30 bg-primary/5 p-6 shadow-bubble mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-bubble bg-primary text-primary-content flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
              </span>
              <h2 className="font-display font-semibold text-lg text-water-deep">Selected activity</h2>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-base-content/60 hover:text-error"
              onClick={() => setSelectedActivity(null)}
            >
              Clear selection
            </button>
          </div>
          {selectedActivity.description && (
            <p className="font-display font-bold text-base text-water-deep mb-2">{selectedActivity.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] mb-2">
            <span className="badge badge-ghost badge-sm font-mono px-1.5 py-0 border border-base-300/60 text-[10px]">
              Code: {getActivityId(selectedActivity)}
            </span>
            <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-primary/30 text-primary text-[10px]">
              Type: {getActivityTypeDisplay(selectedActivity.activity_type).label}
            </span>
            {selectedActivity.topic && (
              <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/70 text-[10px]">
                Topic: {selectedActivity.topic}
              </span>
            )}
            {selectedActivity.subtopic && (
              <span className="badge badge-ghost badge-sm px-1.5 py-0 border border-base-300/50 text-base-content/60 text-[10px]">
                Subtopic: {selectedActivity.subtopic}
              </span>
            )}
          </div>
        </div>
          <form onSubmit={handleSubmit} className="bg-base-100 rounded-blob border-2 border-water-foam/50 p-6 shadow-bubble transition-shadow hover:shadow-bubble-hover">
          <h2 className="font-display font-semibold text-lg text-water-deep mb-1">Assignment details</h2>
          <p className="text-base-content/60 text-sm mb-4">Optional: set a due date or custom title.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="label">
                <span className="label-text font-medium">Due date (optional)</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-label="Due date"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-medium">Title override (optional)</span>
              </label>
              <input
                type="text"
                className={inputClass}
                placeholder="Custom title for this assignment"
                value={titleOverride}
                onChange={(e) => setTitleOverride(e.target.value)}
                aria-label="Title override"
              />
            </div>
          </div>
          {submitError && (
            <div className="alert alert-error rounded-bubble text-sm mb-4">{submitError}</div>
          )}
          <button
            type="submit"
            className="btn btn-primary rounded-bubble shadow-sm hover:shadow-bubble disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating…' : 'Create assignment'}
          </button>
        </form>
        </section>
      )}

      {!selectedActivity && !searchLoading && activities.length === 0 && (
        <div className="rounded-blob border-2 border-dashed border-water-foam/50 bg-base-200/30 p-6 text-center">
          <FontAwesomeIcon icon={faClipboardList} className="text-3xl text-base-content/30 mb-2" />
          <p className="text-base-content/60 text-sm">Search by topic above or enter an Activity ID to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CreateAssignment;
