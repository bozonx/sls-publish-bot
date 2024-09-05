export default {
	ru: {
		// daysOfWeek: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
		closestDays: ['Сегодня', 'Завтра', 'Послезавтра'],
		msk: 'МСК',
		staleMark: 'Просрочено!',

		// Template names
		'template-default': 'Основной',
		'template-byFollower': 'От подписчика',
		'template-noFooter': 'Без футера',

		// State keys
		statePostType: 'Тип поста',
		stateTextLength: 'Кол. символов текста',
		stateMediaCount: 'Кол. медиа файлов',
		stateAuthor: 'Автор',
		stateTags: 'Тэги',
		stateDate: 'Дата',
		stateTime: 'Время',
		stateTemplate: 'Шаблон',
		stateUrlPreview: 'Предпросмотр ссылки',
		stateCreator: 'Кто сделал',
		stateUpdator: 'Кто изменил',

		// Button texts
		toHomeBtn: 'На главную',
		cancelBtn: 'Отмена',
		backBtn: 'Назад',
		nextBtn: 'Далее',
		editConfigBtn: 'Редактирование конфига',
		manageUsersBtn: 'Управление пользователями',
		manageTagsBtn: 'Управлять тэгами',
		sendTextInMdV1Btn: 'Отправить текст в формате Markdown',
		switchToMdv1ModeBtn: 'Переключиться в режим текста Markdown',
		switchToStandardModeBtn: 'Переключиться в обычный режим',
		withoutAuthorBtn: 'Без автора',
		addAuthorBtn: 'Добавить автора',
		clearTagsBtn: 'Сбросить тэги',
		useTemplateBtn: 'Использовать шаблон',
		linkPreviewOffBtn: 'Выключить предпросмотр ссылки',
		linkPreviewOnBtn: 'Включить предпросмотр ссылки',
		pubConfirmBtn: 'Запланировать',
		showPreviewBtn: 'Показать пост',
		deleteSchuduledBtn: 'Удалить',
		editSchuduledBtn: 'Редактировать',
		changeDateTimeBtn: 'Изменить дату и время публикации',
		manageScheduledBtn: 'Управлять отложенными постами',
		publicateNowBtn: 'Опубликовать сейчас',
		replaceOnlyTextBtn: 'Заменить только текст',
		replaceOnlyMediaBtn: 'Заменить только медиа',
		replaceTextAndMediaBtn: 'Заменить и текст и медиа',
		removeTextBtn: 'Удалить текст',
		removeMediaBtn: 'Удалить медиа',
		toListBtn: 'К списку',
		saveBtn: 'Сохранить',

		// Menu descriptions
		homeDescr:
			'Приветствую в боте публикации постов в канал Антифеминизм | Маскулизм!\n\nНапишите или перешлите пост в виде текста, картинки или видео',
		editConfigDescr: 'Отредактируйте конфиг в формате YAML и отправьте обратно',
		tagsManagerDescr:
			'Выберете тэги которые нужно удалить\n\nЧтобы добавить новые тэги, напишите один или несколько тэгов через запятую. Тэги будут переведены в snake_case. Символ # не нужен',
		usersManagerDescr:
			'Чтобы удалить юзера, нажмите на соответсвующую кнопку. Чтобы добавить скиньне сюда пересланое сообщение от юзера. Либо напишиет сообщение в формате YAML вида:\n\nid: number\nname: string\nauthorName: string\nisAdmin?: boolean',
		selectTagsDescr:
			'Выберете тэги\n\nЧтобы добавить новые тэги, напишите один или несколько тэгов через запятую. Тэги будут переведены в snake_case. Символ # не нужен',
		pubPostSetupDescr:
			'Проверьте и настройте публикацию.\n\nНапишите имя автора если нужно',
		pubConfirmDescr: 'Отправляем в отложенные?',
		scheduledListDescr:
			'Выберете отложенную публикацию для управления\n\nЕсли стоит отметка "Просрочено!" то эта публикация уже не будет автоматически опубликована. Вам нужно изменить время публикации или опубликаовать её вручную',
		scheduledEmptyListDescr: 'Нет отложенных публикаций',
		scheduledItemDescr: 'Управление отложенной публикацией',
		// Date and time
		selectDateDescr:
			'Выберете дату либо введите в формате DD.MM. Часовой пояс ${TIME_ZONE}, сейчас',
		selectHourDescr:
			'Выберете время публикации. Часовой пояс ${TIME_ZONE}, текущее время ${CURRENT_TIME}\n\nЕсли нужно более точное время то введите его в формате 1:23 или 9.30 или даже 8 40',
		// Content page
		standardTextModeDescr: 'Обычный режим текста',
		mdV1TextModeDescr:
			'Отправьте текст в формате Markdown вида\n```\n**bold**\n_italic_\n[link text](url)\n\\`monospace\\`\n\n> blockquote\n\n\\`\\`\\`\nsome code\n\\`\\`\\` ```',
		uploadContentDescr: 'Проверьте отображение текста и медиа',
		uploadContentBothDescr:
			'Чтобы заменить или добавить текст и/или медиа отправьте или перешлите сообщение',
		uploadContentTextOnlyDescr:
			'Режим загрузки только текста. Oтправьте или перешлите сообщение, из него будет взят только текст',
		uploadContentMediaOnlyDescr:
			'Режим загрузки только медиа. Отправьте или перешлите сообщение, из него будет взята только картинка или видео. (Загрузка нескольких медиа файлов пока не поддерживается)',

		// Messages
		wrongTypeOfPost:
			'❗ Этот формат поста не поддерживается. Отправьте текст, картинку или видео.',
		youAreNotRegistered:
			'Вы не зарегистрированы, перешлите это сообщение админу',
		tagsWasAdded: 'Тэги были добавлены',
		tagWasDeleted: 'Тэг был удалён',
		scheduledItemWasDeleted: 'Отложенный пост был удалён',
		scheduledItemWasPublished: 'Отложенный пост был успешно опубликован',
		infoMsgToAdminChannel: 'Этот пост будет опубликован в канале',
		wrongTimeFormat: 'Не получается распознать время',
		wrongDateFormat: 'Не получается распознать дату',
		noContentMessage: 'Нет контента',
		wasSuccessfullyScheduled: 'Пост сохранён в отложенные',
		editedSavedSuccessfully: 'Отложенный пост сохранён',
		sessionLost: 'Сессия была утеряна. Начните с начала',
		dateIsPastMessage:
			'Ваша дата из прошлого. Нужна сегодняшняя или будущяя дата',
	},
};
