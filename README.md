# poopmail
A hacky node.js ad-hoc throw-away address mail forwarder. 

TLDR; I wanted my own mailinator-like-thing that delivered mail to my email address but didn't require any maintenance at all. Behold: **poopmail**

#### Who is this for?
**Poopmail** is for people who really *really* hate email. If you've used mailinator you know what I mean. You need an email address, but maybe only for a day or two, and after that you never want to hear from that person/company/government/voice ever again. **Poopmail** can do that for you, forwarding directly to your own email address, without any user interface at all.

#### How does it work?
**Poopmail** uses patterns in email addresses you make up on the fly to determine whether or not it should forward an email on.

Assuming you haven't done any hacking, `poopmail` will extract the first string of more than one number in to address and treat that as a YYMMDD (or YYMMDDHH, or YYMM, in that order) formatted date. Any mail that arrives before that date/time will be forwarded, anything after that date will be dropped. For example, if today was March 25th:

Mail to this address would be forwarded:

```
poop190326@example.com
```

Mail to this address would not:

```
poop190324@example.com
```

Note that this runs on your server's time, so uh, make you you understand timezones and such. Timezones are the worst.

#### What do I need
You need all the things below. If you don't know what any of these are, then you probably don't want Poopmail. You probably want mailinator or some similar service. I don't know what you want really. I want poopmail. And pop tarts.

1. **A server**. Probably a VPS of some sort. It can be cheap, real cheap. So long as it has it's own IP and can accept mail on port 25 you're probably good.
2. **A way to forward ports**. Poopmail runs on port `3025`. Email comes in on port `25`. You can use iptables, or nginx or whatever. For jebus's sake please don't edit `index.js` to change that to `25` and run it as root. Don't be an idiot.
3. **A domain**. A subdomain would also work. So long as you can create `MX` records. If you've gotten this far you know where that `MX` records need to point right?

### Configuration
It's all in `poopmail.json`. The minimum you have to configure is the `to` field. Go ahead and stick your email address in there. å

### Running

```
node index.js
```

### Hacking
You can also hack up `forward.js` with whatever logic you want. You'll get the full email address that the mail was sent to. Return `true` to forward, `false` to drop. Shocking right?
