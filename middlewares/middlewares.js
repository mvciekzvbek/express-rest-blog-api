import db from '../utils/db';

export function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
}

// export function notFound(req, res, next) {
//     const err = new Error('404 not found');
//     err.status = 404;
//     next(err);
// }

// export function catchErrors(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message
//     });
// }

export async function isAuthenticated(req, res, next) {
  const githubToken = req ? req.headers.token : '';

  const currentUser = await db.get()
    .collection('users')
    .findOne({ githubToken });

  req.user = currentUser;
  return next();
}
