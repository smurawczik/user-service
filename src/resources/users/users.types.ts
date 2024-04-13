import { BuildUserDto } from './dto/build-user.dto';

export type GetUsersQuery = Record<keyof BuildUserDto, boolean>;
