const config = {
    locale : 'en',
    id : undefined,
    root : undefined,
    url : '',
    DEFAULT_FONTNAME : '맑은 고딕',
    DEFAULT_FONTSIZE : '10pt',
    DEFAULT_LINEHEIGHT : '1.5',
    plugins : [ 
        'UI', 'Selection', 'Undo', 'Shortcut', 'Enter',
        'FontName', 'FontSize', 'Bold', 'Italic', 'UnderLine',
        'FontColor', 'FontBackgroundColor',
        'Align', 'Outdent', 'Indent', 'LineHeight',
        'InsertText', 'InsertHorizontalRule', 'InsertTable', 'InsertLink',
        'InsertImage', 'InsertHtml',
        'UIResizeWidget',
        'OrderedList', 'UnorderedList',
        'Content', 'Symbol',
        'Migration',
        'EditTable', 'ContextMenu'
    ],
    toolbarItems : [
        'FontName',
        'FontSize',
        'Bold',
        'Italic',
        'UnderLine',
        'FontColor',
        'FontBackgroundColor',
        'SEPARATOR', //분리선
        'Align',
        'OrderedList',
        'UnorderedList',
        'Indent',
        'LineHeight',
        'Symbol',
        'InsertHorizontalRule',
        'InsertLink',
        'InsertTable',
        'InsertImage'
    ]
}

export default config;

export const _webapp = window._webapp || '';

export const defaultContent2 =
    `<html>
    <head>
    </head>
    <body style="margin:5px; font:${config.DEFAULT_FONTSIZE} ${config.DEFAULT_FONTNAME}"; line-height:${config.DEFAULT_LINEHEIGHT}">
        <p style='margin: 0px;line-height:1.5;'><br/></p>
    </body>
</html>`;

export const defaultContent =
    `<html>
    <head>
    </head>
    <body style="margin:5px; font:${config.DEFAULT_FONTSIZE} ${config.DEFAULT_FONTNAME}"; line-height:${config.DEFAULT_LINEHEIGHT}">
<p>Rangy Text Commands Module Demo</p>

<!-- A comment -->
<table>
<tbody>
<tr><td style="border: solid 1px black; width: 100px"><p></br></p></td><td style="border: solid 1px black; width: 100px"><p></br></p></td></tr>
<tr><td style="border: solid 1px black; width: 100px"><p></br></p></td><td style="border: solid 1px black; width: 100px"><p></br></p></td></tr>
</tbody>
</table>
<p id="intro">Please use your mouse and/or keyboard to make selections from the sample content below and use the buttons on
    the left hand size to toggle CSS classes applied to text content within the selection.</p>

<p><b>Association football</b> is a sport played between two teams. It is usually called <b>football</b>, but in
    some countries, such as the United States, it is called <b>soccer</b>. In
    <a href="http://simple.wikipedia.org/wiki/Japan">Japan</a>, New Zealand, South Africa, Australia, Canada and
    Republic of Ireland, both words are commonly used.
</p>
<p>
    Each team has 11 players on the field. One of these players is the <i>goalkeeper</i>, and the other ten are
    known as <i>"outfield players."</i> The game is played by <b>kicking a ball into the opponent's goal</b>. A
    match has 90 minutes of play, with a break of 15 minutes in the middle. The break in the middle is called
    half-time.
</p>
<h2>Competitions <span className="smaller">(this section is editable)</span></h2>
<p>
    There are many competitions for football, for both football clubs and countries. Football clubs usually play
    other teams in their own country, with a few exceptions. <b>Cardiff City F.C.</b> from Wales for example, play
    in the English leagues and in the English FA Cup.
</p>
<h2>Who plays football <span className="smaller">(this section is editable and in pre-formatted text)</span></h2>
</body>
</html>`;

//
// <pre>
// Football is the world's most popular sport. It is played in more
// countries than any other game. In fact, FIFA (the Federation
// Internationale de Football Association) has more members than the
// United Nations.
//
// It is played by both males and females.
//
//
// </pre>
// <p>
//     There are many competitions for football, for both football clubs and countries. Football clubs usually play
//     other teams in their own country, with a few exceptions. <b>Cardiff City F.C.</b> from Wales for example, play
//     in the English leagues and in the English FA Cup.
// </p>
// </body>
// </html>`;
//

