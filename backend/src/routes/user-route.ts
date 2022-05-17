import { Request, Router } from "express";
import { userService } from "../services/UserService";
import { isUndefined, UserDto } from "../../../common-types/src";

const router = Router();

// define routes
router.get(":id", async (req, res) => {
    const id = req.params.id;
    const users = await userService.getUser(id);
    if (isUndefined(users) || users.length === 0) {
        return res.status(404).end();
    }

    return res.json(users);
});

router.post("/hasBeenOnBoarded", async (req: Request<{}, {}, UserDto>, res) => {
    if (req.body === undefined) {
        return res.status(400).send("User hasn't logged in.");
    }
    const result = await userService.doesUserExist(req.body);
    res.json({exists: result});
});

router.post("/onboard", async (req: Request<{}, {}, UserDto>, res) => {
    let userDto = req.body;
    if (userDto === undefined) {
        return res.status(400).send("Body is missing");
    }
    if (userDto.organisation === undefined) {
        return res.status(400).send("organisation is missing");
    }


    const userDoc = await userService.onBoardUser(userDto);
    res.json(userDoc);
});


export default router;
