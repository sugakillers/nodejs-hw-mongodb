import createHttpError from 'http-errors';
import * as contactsServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const getAll = async (req, res) => {

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await contactsServices.getAll({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
  });

  res.json({
    status: 200,
    message: "Successfully retrieved contacts!",
    data: contacts,
});
};

export const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.getById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: "Successfully retrieved contact!",
    data: contact,
  });
};

export const create = async (req, res) => {
  const contact = await contactsServices.create(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const update = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.update(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
};

export const deleteOne = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.deleteOne(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};



export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  create: ctrlWrapper(create),
  update: ctrlWrapper(update),
  deleteOne: ctrlWrapper(deleteOne),
};