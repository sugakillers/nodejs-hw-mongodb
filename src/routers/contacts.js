import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import * as contactsControllers from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/',authenticate, ctrlWrapper(contactsControllers.getAll));

router.get('/:contactId',authenticate, isValidId, ctrlWrapper(contactsControllers.getById));

router.post('/',authenticate, validateBody(createContactSchema), ctrlWrapper(contactsControllers.create));

router.patch('/:contactId',authenticate, isValidId, validateBody(updateContactSchema), ctrlWrapper(contactsControllers.update));

router.delete('/:contactId',authenticate, isValidId, ctrlWrapper(contactsControllers.deleteOne));

export default router;