import createHttpError from 'http-errors';
import * as contactsServices from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFiletoCloidinary } from '../utils/saveFileToCloudinary.js';

export const getAll = async (req, res) => {

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  filter.userId = req.user._id;

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
  const { _id: userId } = req.user;
  const { contactId: _id } = req.params;
  const contact = await contactsServices.getContact({ _id, userId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully retrieved contact with id=${_id}`,
    data: contact,
  });
};

export const create = async (req, res) => {
  let photo;
  if (req.file) {
    photo = await saveFiletoCloidinary(req.file);
  }
  const { _id: userId } = req.user;
  const contact = await contactsServices.create({ ...req.body, userId, photo });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: contact,
  });
};

export const update = async (req, res) => {
  let photo;
  if (req.file) {
    photo = await saveFiletoCloidinary(req.file);
  }
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const contact = await contactsServices.update({ _id, userId }, req.body, photo);

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
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  const contact = await contactsServices.deleteOne({_id, userId});

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};




