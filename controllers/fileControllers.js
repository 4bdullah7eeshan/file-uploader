const getFileDetails = asyncHandler(async (req, res) => {
    const file = await prisma.file.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    res.render("pages/fileDetail", { file, user: req.user });
});

const downloadFile = asyncHandler(async (req, res) => {
    const file = await prisma.file.findUnique({
        where: { id: parseInt(req.params.id) }
    });
    const filePath = path.join(__dirname, "../uploads", file.fileName);
    res.download(filePath);
});

module.exports = {
    getFileDetails,
    downloadFile,
};
