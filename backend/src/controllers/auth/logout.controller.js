

export const logoutController = (req, res) => {
  //since jwt's are stateless i think we have to implement logout on clientside by deleting tokens
  return res.status(200).json({
    message: "Logged out successfully. Please remove tokens from your client.",
  });
};
