# buld failed conditions
Решение для выставление статусов сборки ct(continues test) на основе дополнительных
проверок, основанных на результатах проверок unit тестов, линтеров и т.д.
Архитектура решения подразумевает модульность, которая должна позволить использовать
различные обработчики, выносить их в отдельные npm пакеты, развивать и поддерживать
как отдельные приложения.
![Flow](./img/flow.jpg)
![Before](./img/before.jpg)
![After](./img/after.jpg)

##Модули
###Teamcity
Решение для выставления статуса сборки по мержу в ветку как аналог встроенному
в teamcity средству failed conditions. Решение будет основано на механизме интеграции
с teamcity - service messages, которое позволяет делать много вещей в том числе выстав
ление статуса сборки и причины падения.

###Eslint интеграция с teamcity
`TODO: переформулировать абзац`
Решение выявления новых ошибок линтера eslint и падения сборки `(*подумать*:?с отправкой статуса в
Bitbucket)` будет реализовано как скрипт для сравнение двух результатов проверок по мас
тер ветке и текущей ветки сборки проекта. Программно это будет отдельный модуль, подк
лючаемый к решению по выставлению статуса сборки на основе проверки результирующего
JSON файла на основе заданных условий. Отправка результата сборки реализовываться в
рамках решения не будет, т.к. есть работающее решение в виде плагина для Teamcity ли
шённое недостатков, которые было-бы необходимо решать.

[Подробное описание модулей](./lib/README.md)

###Интеграция с teamcity
Для интеграции используется доработанный скрипт обработки результатов eslint-teamcity,
а также скрипт teamcity-service-messages.
* `eslint-teamcity` для оформления информации об ошибках eslint в удобном виде
* ??? => `teamcity-service-messages` для выставления статуса сборки

###Участие в разработке
PR приветствуются, проверка codestyle и запуск юнит-тестов выполняется автоматически
по PR в репозиторий. Для локального запуска тестов и проверок codestyle необходимо запустить
соответственно `npm test` и `npm codestyle`

##Открытые вопросы
Как спроектировать API для выбора пресетов сравнения параметров проверок а также добавления собственных
* asserts/
  * index.js - главный модуль к которому обращаются, по свичу выбирается пресет
  * newEslintErrors.js - пресет с предопределёнными условиями, отдаёт false/true. false - проверка не прошла
  true - прошла
  
###TODO:
teamcity module - OK
eslint module - OK
при мерже не формируется result.json в нужно йпапке почему-то - OK, проблема возникала из-за асинхронности
TODO: require интерфейс index.js
TODO: тесты на require интерфейс index.js
TODO: приложение не будет работать если в путях есть пробелы
TODO: если форматтер не eslint-teamcity, например когда выполняется локальная проверка. 
То прийдётся выполнять несолько прогонов eslint, один с форматтером json, другой с человекопонятным выводом
TODO: доработка консольного интерфейса для выставления параметров и для eslint и для teamcity
  
##Внимание - известные ограничения
Если в путях присутствуют пробелы, то модуль работать не будет!
  
##Полезные ссылки
* [teamcity test service messages](https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-Supportedtestservicemessages)
* [eslint-teamcity](https://www.npmjs.com/package/eslint-teamcity)
* [teamcity-service-messages](https://github.com/pifantastic/teamcity-service-messages)
