# poopmail
A hacky node.js ad-hoc throw-away address mail forwarder. 

TLDR; I wanted my own mailinator-like-thing that delivered mail to my email address but didn't require any maintenance at all. Behold: poopmail

### Configuration
It's all in `poopmail.json`. The minimum you have to configure is the `to` field. Go ahead and stick your email address in there. 

You'll also need your own server to run this on. And you'll need to point an `MX` record for some domain you own to that server. If you don't know what an `MX` record (or for that matter, a server) is, then this isn't for you. You want mailinator.com. 

### Running
This runs on port `3025`. That means you'll need some sort of port forwarding. For jebus's sake please don't edit `index.js` to change that to `25` and run it as root. Don't do that. Don't. Just `nginx` or `ufw` or hell, `netcat`

To run this: 
`node index.js` 

### Creating an email address
Assuming you haven't done any hacking, `poopmail` will extract the first string of more than one number in to address and treat that as a YYMMDD (or YYMM or YYMMDDHH) formatted date. Any mail that arrives before that date will be forwarded, anything after that date will be dropped. For example, if today was March 25th:

Mail to this address would be forwarded:

```
poop190326@example.com
```

Mail to this address would not:

```
poop190324@example.com
```

### Hacking
You can also hack up `forward.js` with whatever logic you want. You'll get the full email address that the mail was sent to. Return `true` to forward, `false` to drop. Shocking right?
