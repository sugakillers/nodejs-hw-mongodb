import createHttpError from 'http-errors';
import * as contactsServices from '../services/contacts.js';

export const getAll = async (req, res) => {
  const contacts = await contactsServices.getAll();

  res.json({
    status: "success",
    code: 200,
    data: {
      contacts,
  },
});
};

export const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.getById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: "success",
    code: 200,
    data: {
      contact,
    },
  });
};

export const create = async (req, res) => {
  const contact = await contactsServices.create(req.body);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      contact: contact,
    },
  });
};

export const update = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsServices.update(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: "success",
    code: 200,
    data: {
      contact: contact,
    },
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