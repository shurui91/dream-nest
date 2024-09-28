const router = require('express').Router();
const multer = require('multer');

const Listing = require('../models/Listing');
const User = require('../models/User');

/* configuration Multer for file upload */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // save file in public/uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // save file with original filename
    },
});

const upload = multer({ storage });

/* create listing */
router.post('/create', upload.array('listingPhotos'), async (req, res) => {
    try {
        // take the information from the form
        const {
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        } = req.body;

        const listingPhotos = req.files;
        if (!listingPhotos) {
            return res.status(400).send('No file uploaded');
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path);

        const newListing = new Listing({
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            listingPhotoPaths,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        });

        await newListing.save();
        res.status(200).json(newListing);
    } catch (err) {
        console.log(err);
        res.status(409).json({
            message: 'Failed to create listing',
            error: err.message,
        });
    }
});

/* GET LISTINGS BY CATEGORY */
router.get('/', async (req, res) => {
    const qCategory = req.query.category;
    try {
        let listings;
        if (qCategory) {
            listings = await Listing.find({ category: qCategory }).populate(
                'creator'
            );
        } else {
            listings = await Listing.find().populate('creator');
        }
        res.status(200).json(listings);
    } catch (err) {
        res.status(404).json({
            message: 'Failed to fetch listing',
            error: err.message,
        });
        console.log(err);
    }
});

/* GET LISTING BY SEARCH */
router.get('/search/:search', async (req, res) => {
    const { search } = req.params;
    try {
        let listings = [];
        if (search === 'all') {
            listings = await Listing.find().populate('creator');
        } else {
            listings = await Listing.find({
                $or: [
                    { category: { $regex: search, $options: 'i' } },
                    { title: { $regex: search, $options: 'i' } },
                ],
            }).populate('creator');
        }
        res.status(200).json;
    } catch (err) {
        res.status(404).json({
            message: 'Failed to fetch listings',
            error: err.message,
        });
        console.log(err);
    }
});

/* LISTING DETAILS */
router.get('/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId).populate('creator');
        res.status(202).json(listing);
    } catch (err) {
        res.status(404).json({
            message: 'Listing cannot be found!',
            error: err.message,
        });
    }
});

module.exports = router;
