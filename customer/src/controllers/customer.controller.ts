import expressAsyncHandler from 'express-async-handler';
import { CustomerService, customerService } from '~/services/customer.service';
import { successJson } from '~/utils/response';

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  whoami = expressAsyncHandler(async (req, res) => {
    res.json({ msg: '/customer : I am Customer Service' });
  });

  getProfile = expressAsyncHandler(async (req, res) => {
    const result = await this.customerService.getProfile(req.user?.id);
    res.json(successJson(result));
  });

  addNewAddress = expressAsyncHandler(async (req, res) => {
    const result = await this.customerService.addNewAddress(req.user?.id, req.body);
    res.json(successJson(result));
  });

  getShoppingDetails = expressAsyncHandler(async (req, res) => {
    const result = await this.customerService.getShoppingDetails(req.user?.id);
    res.json(successJson(result));
  });

  getWishList = expressAsyncHandler(async (req, res) => {
    const result = await this.customerService.getWishList(req.user?.id);
    res.json(successJson(result));
  });
}

export const customerController = new CustomerController(customerService);
