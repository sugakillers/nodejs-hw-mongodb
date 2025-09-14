import { ContactsCollection } from '../db/models/contacts.js';
import { calculate } from '../utils/calculate.js';

export const getAll = async ({ page, perPage, sortOrder, sortBy, filter }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find(filter);
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculate(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getById = ({ _id, userId }) => ContactsCollection.findOne({ _id, userId });
export const getContact = (filter) => ContactsCollection.findOne(filter);
export const create = (payload) => ContactsCollection.create(payload);
export const update = (filter, payload, options = { new: true }) => {
  return ContactsCollection.findOneAndUpdate(filter, payload, options);};
export const deleteOne = (filter) =>
  ContactsCollection.findOneAndDelete(filter);