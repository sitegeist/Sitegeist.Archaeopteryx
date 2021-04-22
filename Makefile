###############################################################################
###############################################################################
##                                                                           ##
##                         Sitegeist.Archaeopteryx                           ##
##                                                                           ##
###############################################################################
###############################################################################

###############################################################################
#                                VARIABLES                                    #
###############################################################################
SHELL=/bin/bash
PHP=/usr/bin/php

###############################################################################
#                             INSTALL & CLEANUP                               #
###############################################################################
install::
	@$(PHP) /usr/local/bin/composer install

cleanup::
	@rm -f composer.lock
	@rm -rf Packages
	@rm -rf Build
	@rm -rf bin

###############################################################################
#                                    QA                                       #
###############################################################################
lint::
	@$(PHP) bin/phpcs \
		--standard=PSR2 \
		--extensions=php \
		--exclude=Generic.Files.LineLength \
		Classes/ Tests/

analyse::
	@$(PHP) bin/phpstan analyse --level 8 Classes

test::
	@$(PHP) bin/phpunit -c phpunit.xml \
		--enforce-time-limit \
		--coverage-html Build/Reports/coverage \
		Tests

test-isolated::
	@$(PHP) bin/phpunit -c phpunit.xml \
		--enforce-time-limit \
		--group isolated \
		Tests

github-action::
	@act -P ubuntu-20.04=shivammathur/node:focal