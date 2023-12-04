import { app } from './app';
import { PORT } from './config';
import { ERRORS_MSGS, SUCCESS_MSGS } from './constants/responses';
import { connectDB } from './db';

export const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(SUCCESS_MSGS.SERVER_ON);
    });
  } catch {
    console.log(ERRORS_MSGS.INTERNAL_SERVER_ERROR);
  }
};
