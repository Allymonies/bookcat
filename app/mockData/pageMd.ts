export const pageMarkdown = `
#example #test #example/complete

^named

[[page-1#^named]]
**this is bold**, *while this is italic*, ==this is HIGHLIGHTED== and ~~this isn't here (strikethrough)~~ %% this is a comment, ignore me :) %%
**_bold and italic_**
$1 + 1 = \\text{math}$
and
\`this is code\`
\`\`\`js
const is = 'code formatted by language?'
\`\`\`

\`\`\`python
#const is = 'this isnt'
is_var = "but this is python"
\`\`\`

# H1

## H2

### H3

#### H4

##### H5

###### H6

this text is <ruby>special<rt>ruby text</rt></ruby>

[[Welcome | Named link to welcome]]

[[Welcome#^0b6134|Link to block in welcome]]

[this is a link to a site!](https://google.com)

[this is a relative link](abc/123)

[this is an absolute path](/index)

![external img](https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png)


> [!summary]+ Abstract callout
> This is below the (default open) fold
> A third line below the fold

>[!info]- Info callout
>minimized by default

>[!todo] // TODO
>(Always open)

>[!tip] tip:
>markdown is cool :)

>[!success] success
>yay ^w^

>[!faq]+ question?
>answer

>[!failure] oopsy
>we made a fucky wucky

>[!danger] BEWARE
>cat :3

>[!bug] SCARY
>oh not that kind of bug

>[!example] woah
>this is all an example!

>[!cite] this is a quotation
>or a citation! see: my buddy

#tag

1. number 1
2. number 2
1. number 1 again

- bullet
	- nested bullet
- back again

- [ ] todo: do a task
- [x] todo: did a task

> quote: i am a cool person

***
section line ^
footnote [^1]

[^1]: this explains footnote 1

This has ^[an inline footnote]

| Table | Data |  Z  |
| ----: | :--: | :-- |
| 1,1   |  2,1 |  L  |
| 1,2   |  2,2 |  L  |

\`\`\`mermaid
sequenceDiagram
    A->>+B: Sequence a->b
    A->>+B: syn
    B-->>-A: ack
    B-->>-A: diagrams are cool!
\`\`\`
`;