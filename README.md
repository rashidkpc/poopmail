![Poopmail Logo](https://raw.githubusercontent.com/rashidkpc/poopmail/master/poopmail.jpg)

A hacky node.js ad-hoc throw-away address mail forwarder. 

TLDR; I wanted my own mailinator-like-thing that delivered mail to my email address but didn't require any maintenance at all. Behold: **poopmail**. This is basically abandon-ware, I use it, you can use it if you want. If it doesn't work, fix it and submit a pull. 

#### Who is this for?
**Poopmail** is for people who really *really* hate email, but for some idiotic reason also don't want to use some other service for temporary emails. If you've used mailinator you know what I mean. You need an email address, but maybe only for a day or two, and after that you never want to hear from that person/company/government/voice ever again. **Poopmail** can do that for you, forwarding directly to your own email address, without any user interface at all.

#### How does it work?
**Poopmail** uses patterns in email addresses you make up on the fly to determine whether or not it should forward an email on to you, or if it should drop it and never tell you about it. Ever.

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
Copy `poopmail.json.sample` to `poopmail.json`. Then:

1. Set `to` to the email address you wish to forward mail to.
2. Set `domains` to a `["list.of", "domains.com" ]` that you have MX records for and you want **poopmail** to handle.
3. Set `default_accept` to what you want to happen if the email is not accepted by the date filter parser thing (or any other plugin). You almost certainly want this to be `false`, especially with the default plugin set. Otherwise you'll get a TON of garbage. 

### Running
You probably need Node.js 10. Probably. Look, I don't know, you should probably know something or another about deploying Node.js apps. Probably. Don't ask me. 

```
node index.js
```

### Hacking
I bet you saw that `plugins/` directory didn't you? So how does that work? See `plugins/index.js`? That contains an array of functions. Each of those functions will receive the email sent. The first function to return `true` (forward the email) or `false` (don't forward the email) deterimes the fate of the email. Return anything else (I suggest `null`), and **poopmail** will move onto the next function. 

You'll notice that the last plugin is called `finally`. `finally` returns the value of `default_accept` (default: `false`) from `poopmail.json`. Like I said above, you almost certainly want to leave that as `false`

The format of the email object passed into the functions looks like this. I think the names are pretty self explanitory right?

```
incoming = {
  from
  to,
  subject,
  text,
  html,
};
```

Good luck. It's your email so if you screw something up it's your problem. But then, it's email you didn't care about anyway, right?

