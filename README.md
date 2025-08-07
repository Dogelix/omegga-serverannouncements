# serverannouncements

A simple [omegga](https://github.com/brickadia-community/omegga) plugin that posts announcements in the server at times set by you.

The messages will be broadcast to all online players.


## Install & update

```bash
# install
omegga install gh:Dogelix/serverannouncements

# update
omegga update serverannouncements
```

## Config

All config options configurable in omeggas web UI.

### Announcement Structure
```
{
    "time": number                  // How often you want the annoucement to run.
    "period": "mins" | "hours"      // Whether the time you set is in minutes or hours.
    "message": "string"             // The message you want to send
    "offset": "number"              // An optional offset to announcements which will start the interval after x minutes.
}
```


### Example Announcements
```json
[
    {
        "time": 1, 
        "period": "hours", 
        "message":"Please be aware that the server restarts at 01:00 UTC"
    },
    {
        "time": 1, 
        "period": "hours", 
        "message":"Want to join our Discord? https://discord.gg/UcdwTYhS75",
        "offset": 10 
    }
]
```

### Example Output
`[Announcement] Please be aware that the server restarts at 01:00 UTC`