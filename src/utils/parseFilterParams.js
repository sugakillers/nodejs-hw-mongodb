/*const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(contactType)) return contactType;
};

const parseIsFavourite = (isFavourite) => {
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
  return undefined;
};


export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};*/

// src/utils/parseFilterParams.js

const parseContactType = (contactType) => {
  const isContactType = ['work', 'home', 'personal'];
  if (typeof contactType === 'string' && isContactType.includes(contactType)) {
    return contactType;
  }
};

const parseIsFavourite = (isFavourite) => {
  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  const filter = {};

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  if (parsedType) {
    filter.contactType = parsedType;
  }

  if (parsedIsFavourite !== undefined) {
    filter.isFavourite = parsedIsFavourite;
  }

  return filter;
};
