const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['in_progress', 'completed'];

function isBlank(value) {
  return typeof value !== 'string' || value.trim() === '';
}

export function validateTaskPayload(body, { partial = false } = {}) {
  const errors = [];
  const data = {};
  const source = body && typeof body === 'object' ? body : {};

  if (!partial || source.title !== undefined) {
    if (isBlank(source.title)) errors.push('Title is required');
    else data.title = source.title.trim();
  }

  if (source.description !== undefined) {
    data.description = typeof source.description === 'string' ? source.description.trim() : '';
  } else if (!partial) {
    data.description = '';
  }

  if (!partial || source.dueAt !== undefined) {
    const due = new Date(source.dueAt);
    if (!source.dueAt || Number.isNaN(due.getTime())) errors.push('Date and time are required');
    else data.dueAt = due;
  }

  if (source.endAt === '' || source.endAt === null) {
    data.endAt = null;
  } else if (source.endAt !== undefined) {
    const end = new Date(source.endAt);
    if (Number.isNaN(end.getTime())) errors.push('End time is invalid');
    else data.endAt = end;
  }

  if (source.priority === '' || source.priority === null) {
    data.priority = undefined;
  } else if (source.priority !== undefined) {
    if (!PRIORITIES.includes(source.priority)) errors.push('Priority must be low, medium, or high');
    else data.priority = source.priority;
  }

  if (source.status !== undefined) {
    if (!STATUSES.includes(source.status)) errors.push('Status must be in_progress or completed');
    else data.status = source.status;
  }

  if (data.dueAt && data.endAt instanceof Date && data.endAt.getTime() <= data.dueAt.getTime()) {
    errors.push('End time must be after the start time');
  }

  return { errors, data };
}

export function validateStatus(status) {
  if (!STATUSES.includes(status)) {
    return { error: 'Status must be in_progress or completed' };
  }
  return { status };
}
