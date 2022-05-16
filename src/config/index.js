import { TOOLBAR_SEPARATOR } from "./constant";

const config = {
    locale : 'en',
    id : undefined,
    root : undefined,
    DEFAULT_FONT : '10pt 맑은 고딕',
    LINE_HEIGHT : '1.5',
    plugins : [ 
        'UI', 'Selection', 'Undo', 'Shortcut', 'Enter',
        'FontName', 'FontSize', 'Bold', 'Italic', 'UnderLine',
        'FontColor', 'FontBackgroundColor',
        'Align', 'Outdent', 'Indent', 'LineHeight',
        'InsertText', 'InsertHorizontalRule', 'InsertTable', 'InsertLink',
        'InsertImage',
        'UITableWidget', 'UIResizeWidget',
        'OrderedList', 'UnorderedList',
        'Content', 'Symbol'
        //'Migration'
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
    <body style="margin:5px; font:${config.DEFAULT_FONT}"; line-height:${config.LINE_HEIGHT}">
        <p style='margin: 0px;line-height:1.5;'><br/></p>
    </body>
</html>`;

export const defaultContent =
    `<html>
    <head>
    </head>
    <body style="margin:5px; font:${config.DEFAULT_FONT}"; line-height:${config.LINE_HEIGHT}">
<p>Rangy Text Commands Module Demo</p>

<!-- A comment -->
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
<table style="width: 743px; height: 155px;"> <tbody> <tr style="height: 20.915%;"> <td style="width: 24.4265%;    border: solid;" colspan="2"><strong>Next</strong><strong> Q Marketing Budget</strong></td> <td style="width: 24.1565%;     border: solid;" colspan="2"><strong>January</strong> </td> <td style="width: 16.4642%; " colspan="2"><strong>February</strong> </td> <td style="width: 23.8866%; " colspan="2"><strong>March</strong></td> </tr> <tr style="height: 20.915%;"> <td style="width: 12.4157%;" rowspan="5"><strong>Campaign</strong></td> <td style="width: 12.0108%;">﻿</td> <td style="width: 12.1457%; ">Planned</td> <td style="width: 12.0108%; ">Actual</td> <td style="width: 16.4642%; ">Planned</td> <td style="width: 11.0661%; ">Actual</td> <td style="width: 12.1457%; ">Planned</td> <td style="width: 11.7409%; ">Actual</td> </tr> <tr style="height: 15.0327%;"> <td style="width: 12.0108%; ">Social Media</td> <td style="width: 12.1457%; ">2000</td> <td style="width: 12.0108%; ">1850</td> <td style="width: 16.4642%; "><span style="">2000</span></td> <td style="width: 11.0661%; "><span style="">2000</span></td> <td style="width: 12.1457%; "><span style="">2000</span></td> <td style="width: 11.7409%; "><span style="">2000</span></td> </tr> <tr style="height: 14.3791%;"> <td style="width: 12.0108%; ">TV Ads</td> <td style="width: 12.1457%; ">40 000</td> <td style="width: 12.0108%; ">55 000</td> <td style="width: 16.4642%; "><span style="">40 000</span></td> <td style="width: 11.0661%; ">40 000</td> <td style="width: 12.1457%; "><span style="">-</span></td> <td style="width: 11.7409%; ">-</td> </tr> <tr style="height: 14.3791%;"> <td style="width: 12.0108%; ">Flyers</td> <td style="width: 12.1457%; ">550</td> <td style="width: 12.0108%; ">550</td> <td style="width: 16.4642%; ">-&nbsp;</td> <td style="width: 11.0661%; ">-</td> <td style="width: 12.1457%; ">-</td> <td style="width: 11.7409%; ">-</td> </tr> <tr style="height: 14.3791%;"> <td style="width: 12.0108%; ">Radio Ads</td> <td style="width: 12.1457%; ">15 000</td> <td style="width: 12.0108%; ">15 000</td> <td style="width: 16.4642%; ">10 000</td> <td style="width: 11.0661%; ">10 000</td> <td style="width: 12.1457%; ">5000</td> <td style="width: 11.7409%; ">5000</td> </tr> </tbody> </table>
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

