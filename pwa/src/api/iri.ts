export const toRelativeIri = (iri: string): string => {
  if (!iri) {
    return iri;
  }

  try {
    if (iri.startsWith('http://') || iri.startsWith('https://')) {
      return new URL(iri).pathname;
    }
  } catch {
    // keep original value
  }

  return iri;
};

export const getResourceId = (iri?: string): string => {
  if (!iri) {
    return '';
  }

  return iri.split('/').filter(Boolean).pop() ?? '';
};
