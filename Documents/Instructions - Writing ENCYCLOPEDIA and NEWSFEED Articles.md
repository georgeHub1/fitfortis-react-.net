# Writing ENCYCLOPEDIA and NEWSFEED Articles

This document describes the best practices when it comes to authoring articles, for the Encyclopedia, 
and for the Newsfeed. 

1. Do not format content, using HTML
2. Use only approved tags
3. Well-formed HTML
4. All paragraphs of text should be insider `<p></p>` tags
5. Tables
6. Images
7. Videos
8. Web pages
9. Best practices for Newsfeed articles
10. Citations using `<cite>` tags



------
# 1. Do not format content, using HTML. 
DO NOT format using HTML. HTML should be used only to declare structure (this is a title, this is a paragraph, 
this is a list, etc). We will do the formatting using CSS. 

This way we can ensure consistency and beauty of the content, as well as support different screen sizes 
successfully. 



------
# 2. Use only approved tags
The approved tags are:
```
<h1>...</h1>
<h2>...</h2>
<h3>...</h3>
<h4>...</h4>

<p>...</p>
<a>...</a>

<i>...</i>         --> use in a VERY limited way
<b>...</b>         --> use in a VERY limited way

<img>...</img>
<iframe>...</iframe>

<cite>...</cite>   --> for citations
```



------
# 3. Well-formed HTML
Always use well-formed HTML. Every start tag `<xyz>` should have a closing tag `</xyz>`.
```
<xyz>
Every opening tag XYZ needs to have a corresponding closing tag.
</xyz>
```



------
# 4. All paragraphs of text should be insider `<p></p>` tags
All paragraphs should reside inside `<p></p>` tags. DO NOT USE `<br/>` tags for separation of paragraphs:
```
<p>
This is a paragraph. It should be left to flow, without use of BR tags. 
</p>
```



------
# 5. Tables
Tables can sometimes be useful for presenting tabular information. The structure of a table should be as follows:
```
<table>
  <thead>                        --> THEAD indicates the header rows of the table
    <tr>
      <th>Sex at birth</th>
      <th>Height</th>
    </tr>
  </thead>

  <tbody>                        --> TBODY indicates the body
    <tr>
      <td>Female</td>
      <td>5ft 4in</td>
    </tr>
    <tr>
      <td>Male</td>
      <td>5ft 9in</td>
    </tr>
  </tbody>

  <tfoot>                        --> TFOOT indicates the footer of the table, used for totals, etc.
    <tr>
      <th>Average</th>
      <th>...</th>
    </tr>
  </tfoot>
</table>
```

## 5a. Avoid tables in general; definitely no tables for formatting
DO NOT use tables for formatting. Table-based formatting is an obsolete HTML technique, which breaks down 
in the modern world of different end-points and adaptive UX. It's very important to note, that HTML 
determines **structure**, not **form**. Any formatting should be done by CSS, not with HTML techniques, 
such as tables.  



------
# 6. Images
Format images as follows, to ensure that they flow and resize properly.
```
<p>
  <img
    src=""
    width="854" height="480"
    frameborder="0"
    scrolling="no"
    >
  </img>
</p>
```

You can get a lot of free images from **https://pixnio.com**. Don't forget to add attribution to the image with a `<cite>` tag as follows:
```
<cite>Image: <a href="https://pixnio.com">pixnio.com</a>
```


------
# 7. Videos
Always use the video snippet below, changing just the SRC attribute of the IFRAME tag. This ensures that 
video gets scaled up and down on various different screen sizes.
```
<p>
  <div style="position:relative;height:0;padding-bottom:56.25%">
    <iframe 
      src="https://embed.ted.com/talks/lang/en/bill_gates_the_next_outbreak_we_re_not_ready" 
      width="854" height="480" 
      style="position:absolute;left:0;top:0;width:100%;height:100%" 
      frameborder="0" 
      scrolling="no" 
      allowfullscreen
      >
    </iframe>
  </div>
</p>
```

For YouTube videos, you can also force showing subtitles, by adding the following parameters to the video URL:
```
YOUTUBE_VIDEO_URL?hl=en&cc_lang_pref=en&cc_load_policy=1
```

Here's the detailed example:
```
<p>
  <div style="position:relative;height:0;padding-bottom:56.25%">
    <iframe 
      src="https://www.youtube.com/embed/-LKVUarhtvE?&hl=en&cc_lang_pref=en&cc_load_policy=1" 
      width="854" height="480" 
      style="position:absolute;left:0;top:0;width:100%;height:100%" 
      frameborder="0" 
      scrolling="no" 
      allowfullscreen
      >
    </iframe>
  </div>
</p>
```



------
# 8. Web pages
There are situations, when we need to host an external web page. This, in general, is discouraged due to 
security concerns. When it absolutely must happen, the way to do is as follows:
```
<p>
  <div style="position:relative;height:0;padding-bottom:56.25%">
    <iframe
      src="//gisanddata.maps.arcgis.com/apps/Embed/index.html?webmap=14aa9e5660cf42b5b4b546dec6ceec7c&extent=77.3846,11.535,163.5174,52.8632&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light"
      title="2019-nCoV" 
      width="650" height="400" 
      style="position:absolute;left:0;top:0;width:100%;height:100%" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      >
    </iframe>
  </div>
</p>
```


------
# 9. Best practices for Newsfeed articles
We ALWAYS show the 1st paragraph (the first thing enclosed in a `<p>...</p>` tag) of a NEWSFEED article 
in the unit that shows on the homepage. This is important to note because there are situations, when we 
need to add an attribution at the top of an article. That attribution is added at the top, within `<cite>` 
tags, WITHOUT encasing it into a `<p>` tag.

```
<cite>
Article by Jeff Wise, originally published in 
<a href="https://nymag.com/intelligencer/2020/03/the-story-of-a-coronavirus-infection.html">NY Mag</a> 
on March 18, 2020
</cite>

<p>
You call a friend and arrange to meet for lunch. It’s unseasonably springlike, so you choose a 
place with outdoor seating, which seems like it should be safer. As usual, you take all reasonable 
precautions: You use hand sanitizer, sit a good distance from other customers, and try to avoid 
touching your face, though that last part is hard. A part of you suspects that this whole thing 
might be overblown.
</p>

<p>
...
```

With the example above the full article will show the full content, while the NEWSFEED unit will show 
only the 1st paragraph ("You call a friend and arrange...").


------
# 10. Citations using `<cite>` tags
Citations (either at the top of an article, in the middle of an article, or at the bottom) should 
be done within a `<cite>` tag as follows:

```
<cite>Article by Jeff Wise, originally ... </cite>

<p>
You call a friend and ...
...
```

This is an example of a bottom citation:

```
...
<p>
Treatment with antiviral medicines...
</p>

<cite>
Centers for Disease Control and Prevention
</cite>
```
