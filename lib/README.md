#Описание модулей

##eslint
модуль поддерживают два интерфейса, консольный и nodejs через require
модуль получает на вход три аргумента, ничего не возвращая
модуль работает по принципу grunt - работа осуществляется только с файлами
результатом работы модуля является result.json - отчёт вида
eslintresult в котором будут только уникальные ошибки путь задаётся через
настройки

##teamcity
модуль предоставляет api:
* для выставление статуса сборки
* представление результатов проверки eslint в виде teamcity test service messages
* получение артефакта на основе версии из package.json
* выставление имени сборки (buildId) для последующей идентификации
* получение номера ПР по которому собирается сборка

##bitbucket
//TODO * получение целевой ветки ПР

###Техническое описание

####Получение результатов проверки eslint для master ветки
Получение результатов проверки для мастер ветки будет выполняться путём произведения
запросов к teamcity REST API(модуль teamcity) с целью получения артефакта, содержащего файл result.json
Практически будет выполнено несколько запросов с целью выявления последней успешной сбор
ки по master ветке и получение самого артефакта. Мастер ветка определяется исходя из поля
версии в package.json продукта, для которого выполняется скрипт. _(Или возможно исходя из информации из
stash, но для этого нужно писать плагин для stash)_

####Сравнение результатов
Полученный `result.json` и `result.json` текущей сборки соответственно переименовывются в 
`fromMaster.json` и `fromCurrent.json`. Пути к полученным файлам передаются в скрипт срав
нения и на выходе скрипт генерирует результирующий `result.json`.
Скрипт сравнения поддерживает два интерфейса передачи входных данных:
* интерфейс командной строки:
  аргументы передаются как master и current
* интерфейс модуля:
  аргументы передаются в объекте с ключами master и current

##teamcity
модуль поддерживают два интерфейса, консольный и nodejs через require
модуль получает на вход 

##bitbucket