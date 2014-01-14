---
layout: snippet
title:  "Diving into WebDev with Bizfriendly"
date:   2013-12-30 04:04:00
description: My first significant web development project
url: tylor.im/blog/2013/08/26/diving-into-webapp-dev-with-bizfriendly.html
categories: projects
name: bizfriendly
image: /imgs/bizfriendly-logo.png
---

A large portion of my contributions at Code for America were made on the [Bizfriend.ly][Bizfriendly] service and client. The project was part of the CfA 2013 Kansas City Team's efforts for helping small business owners utilize internet services. 

From a distance, Bizfriendly might be brushed off as just another how-to creation site. Ironically, I had just been given a subscription to [Grovo][Grovo] so I was initially uninterested in the prospect of working on something so similar. It wasn't until Andrew Hyder gave me a more detailed explanation of the project that I saw how unique it was. There were quite a few aspects that compelled me to contribute.


Product
-------
From a product perspective has a few *awesome* differentiating factors.

+ The service is free! (Unless you count any governmental/tax funding)

When I think of how to make a wide impact through software, I always consider the cost of use. This point immediately differentiates the Bizfriendly project from services like Lynda/Grovo.

+ Content is user-generated.

This is critical for broadening the scope of the service. Many other sites curate their content and choose publishers. (It also introduces some of the more interesting technical difficulties of the project)

+ Learning is interactive.

When I think how-to's and tutorials, I think of sequential task lists - I think eHow, wikiHow, youtube, etc. Bizfriendly's how-to experience interleaves tasks, actions, and feedback to make lessons more accessible. To me, this is Bizfriendly's bread and butter. Remember clippy? Take him, remove the creepy sprite, abolish the awful/intrusive/assumptive/distractive notifications, break his annoyingly peppy attitude (seriously, how happy could a paper-clip *really* be), and expand his wisdom to all of the internet. 


Execution
--------------
We've all heard "I like to work on interesting problems" a million times. My strongest interest in Bizfriendly was rooted in my questions about how our execution could fulfill the project's goals.

> How can various APIs be generalized enough to support how-tos on many services?

> How can the actions offered by that API generalization be kept simple enough to encourage user generated tutorials?

I was unable to answer these questions without seeing the performance of a prototype, which I took to be a great sign. While I knew that the scope of my contributions may not include fully answering these questions, I couldn't them so compelling that I wanted to help. The promise of the learning I would be able to do while helping with a prototype/beta was icing on the cake.


Technical
--------------
The project took the form of a SoA which provides user models, content management, and service API generalizations. (I'm most excited by the prospect of having an open source service to generalize various API interactions. It's like [IFTTT][IFTTT] for developers)

The backend is developed in [Flask][Flask], a micro-framework for web development in Python. The database for users and content is in postgres with SqlAlchemy as an ORM.

The frontend is all in Javascript enclosures, JQuery, HTML5, and bootstrap. Both the frontend and backend are served on Heroku, though as different applications to enforce the SoA split and encourage creation of other clients.

My technical contributions were mostly to the user models. I made the user creation, authentication, and management flows on the backend as well as the OAuth linking to twitter and facebook. I then made the frontend user models and view to allow the frontend to use the service for authentication. I also started on some of the code necessary for user tracking. In order to facilitate featured how-tos and leader boards, we thought it would be necessary to see which how-tos were actually being used and completed by users.


Take-aways
-------------
Working on Bizfriendly at Code for America was a unique experience which taught me a lot. It was the first time I had strict shipping deadlines for code, which was exciting. It's one thing to code for fun, it's another to know that your features will be demoed to multiple mayors in the near future. This also gave great encouragement for me to learn web development as fast as I could. Before this project, my experience was almost entirely with embedded software, so I had a lot of catching up to do.
Overall, Bizfreindly was a very interesting project and just what I needed to dive into web development.



[Grovo]: http://www.grovo.com/
[Bizfriendly]: www.bizfriend.ly
[Flask]: http://flask.pocoo.org/
[IFTTT]: https://ifttt.com/