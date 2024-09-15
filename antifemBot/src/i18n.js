export default {
	ru: {
		closestDays: ['Сегодня', 'Завтра', 'Послезавтра'],
		msk: 'МСК',
		staleMark: 'Просрочено!',
		itemHasNoContent: 'Без контента',
		now: 'Сейчас',

		// Template names
		'template-default': 'Основной',
		'template-byFollower': 'От подписчика',
		'template-noFooter': 'Без футера',
		'template-gotFrom': 'Взято из',

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
		stateForcePublishedBy: 'Кто намеряно опубликовал',
		stateChangedTimeBy: 'Кто изменил время',

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
		linkPreviewSelectBtn: 'Выбрать ссылку для предпросмотра',
		linkPreviewToTopBtn: 'Сделать предпросмотр ссылки сверху',
		linkPreviewToBottomBtn: 'Сделать предпросмотр ссылки снизу',
		pubConfirmBtn: 'Да, запланировать публикацию',
		showPostBtn: 'Показать пост',
		deletePostBtn: 'Удалить',
		editPostBtn: 'Редактировать',
		deleteUserBtn: 'Удалить пользователя',
		changeDateTimeBtn: 'Изменить дату и время публикации',
		manageScheduledBtn: 'Управлять отложенными постами',
		publicateNowBtn: 'Опубликовать сейчас',
		replaceOnlyTextBtn: 'Заменить только текст',
		replaceOnlyMediaBtn: 'Заменить медиа',
		replaceTextAndMediaBtn: 'Заменить и текст и медиа',
		removeTextBtn: 'Удалить текст',
		removeMediaBtn: 'Удалить медиа',
		toListBtn: 'К списку',
		saveBtn: 'Сохранить',
		publishedBtn: 'Опубликованные',
		conservedBtn: 'Консервы',
		toScheduledBtn: 'В отложенные',
		saveToConservedBtn: 'Сохранить в консервы',
		toConservedBtn: 'В консервы',

		// Menu descriptions
		homeDescr:
			'Приветствую в боте публикации постов в канал Антифеминизм | Маскулизм!\n\nНапишите или перешлите сюда пост в виде текста, картинки или видео',
		editConfigDescr: 'Отредактируйте конфиг в формате YAML и отправьте обратно',
		tagsManagerDescr:
			'Выберете тэги которые нужно удалить\n\nЧтобы добавить новые тэги, напишите один или несколько тэгов через запятую. Тэги будут переведены в snake_case. Символ # не нужен',
		usersManagerDescr:
			'Юзеры.\n\nЧтобы добавить юзера скиньте сообщение-приглашение сюда',
		userItemDescr:
			'Управление пользователем\n\nЧтобы изменить юзера скиньте сюда его данные в формате YAML',
		selectTagsDescr:
			'Выберете тэги\n\nЧтобы добавить новые тэги, напишите один или несколько тэгов через запятую. Тэги будут переведены в snake_case. Символ # не нужен',
		pubPostSetupDescr:
			'Проверьте и настройте публикацию\n\nНапишите имя автора если нужно',
		pubConfirmDescr: 'Отправляем в отложенные?',
		scheduledListDescr:
			'Выберете отложенную публикацию для управления\n\nЕсли стоит отметка "Просрочено!" то эта публикация уже не будет автоматически опубликована, в этом случае вам нужно изменить время публикации или опубликаовать вручную.',
		waitForPublicationsListInDescr: 'Ожидают публикации',
		scheduledEmptyListDescr: 'Нет отложенных публикаций',
		scheduledItemDescr: 'Управление отложенной публикацией',
		conservedListDescr: 'Консервы',
		conservedEmptyListDescr: 'Нет консерв',
		conservedItemDescr: 'Управление консервой',
		publishedListDescr: 'Опубликованные посты',
		publishedEmptyListDescr: 'Ничего пока не опубликовано',
		publishedItemDescr: 'Управление опубликованным постом',
		// Date and time
		selectDateDescr: 'Выберете дату либо введите в формате DD.MM',
		selectHourDescr:
			'Выберете время публикации.\n\nЕсли нужно более точное время то введите его в формате 1:23 или 9.30 или даже 8 40',
		// Content pageH
		standardTextModeDescr: 'Обычный режим текста',
		mdV1TextModeDescr:
			'Отправьте текст в формате Markdown с таким форматированием:\n```\n**bold**\n*italic*\n[link text](https://example.com)\n\\`monospace\\`\n\n> blockquote\n\n\\`\\`\\`\nsome code\n\\`\\`\\` ```',
		selectLinkPreview: 'Выберете ссылку для которой будет сделан предпросмотр',
		uploadContentDescr:
			'Проверьте отображение текста и медиа.\nЛимит длины текстового сообщения - 4096 символов.\nЛимит подписи к картинке/видео 1024 символа.\nМакс. количество медиа фалов - 10 (пока поддреживается только 1)',
		'uploadContentDescr-both':
			'Чтобы заменить или добавить текст и/или медиа отправьте или перешлите сюда сообщение',
		'uploadContentDescr-textOnly':
			'Режим загрузки только текста. Oтправьте или перешлите сюда сообщение, из него будет взят только текст',
		'uploadContentDescr-mediaOnly':
			'Режим загрузки только медиа. Отправьте или перешлите сюда сообщение, из него будет взята только картинка или видео',

		// Messages
		wrongTypeOfPost:
			'❗ Этот формат поста не поддерживается. Отправьте текст, картинку или видео.',
		tagsWasAdded: 'Тэги были добавлены',
		tagWasDeleted: 'Тэг был удалён',
		scheduledItemWasDeleted: 'Отложенный пост был удалён',
		scheduledItemWasPublished: 'Отложенный пост был успешно опубликован',
		conservedItemWasPublished: 'Консерва была успешно опубликована',
		conservedItemWasDeleted: 'Консерва была удалена',
		publishedItemWasDeleted: 'Опубликованный пост был удалён',
		scheduledInfoMsgToAdminChannel: 'Пост добавлен в отложенные',
		conservedInfoMsgToAdminChannel: 'Пост добавлен в консервы',
		wrongTime: 'Не верное время',
		wrongDate: 'Не верная дата',
		noContentMessage: 'Нет контента',
		wasSuccessfullyScheduled: 'Пост сохранён в отложенные',
		wasSuccessfullyConserved: 'Пост сохранён в консервы',
		editedSavedSuccessfully: 'Отложенный пост сохранён',
		sessionLost: 'Сессия была утеряна. Начните с начала',
		dateIsPastMessage:
			'Ваша дата из прошлого. Нужна сегодняшняя или будущяя дата',
		timeIsPastMessage:
			'Это прошлое время. Нужно будущее время. Минимум 10 минут от текущего времени',
		errorSendToAddmin:
			'Отправьте это сообщение об ошибке Ивану и нажмите /start',
		youAreNotRegistered: 'Вы не зарегистрированы, обратитесь к админу',
		youWasAddedToApp: 'Вы были добавлены в бота, нажимте ещё раз /start',
		deleteNoMsgInDestinationChannel:
			'Сообщение в канале не найдено, возможно оно уже было удалено. Будет удалена только запись в базе данных',
		updateNoMsgInDestinationChannel:
			'Сообщение в канале не найдено, возможно оно уже было удалено',
	},
};
