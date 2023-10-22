<?php

declare(strict_types=1);

namespace Sitegeist\Archaeopteryx;

use GuzzleHttp\Psr7\Uri;
use Neos\Flow\Annotations as Flow;
use Psr\Http\Message\UriInterface;

/**
 * Link value object for node properties,
 *
 * ```yaml
 * My.Content:
 *   properties:
 *     link:
 *       type: 'Sitegeist\Archaeopteryx\Link'
 * ```
 *
 * @Flow\Proxy(false)
 */
final class Link implements \JsonSerializable
{
    public const TARGET_SELF = '_self';
    public const TARGET_BLANK = '_blank';

    public const REL_NOOPENER = 'noopener';
    public const REL_NOFOLLOW = 'nofollow';

    /**
     * @param array<int, string> $relNofollow
     */
    private function __construct(
        public readonly UriInterface $href,
        public readonly ?string $title,
        public readonly ?string $targetBlank,
        public readonly ?array $relNofollow
    ) {
    }

    /**
     * @param array<int, string> $relNofollow
     */
    public static function create(
        UriInterface $href,
        ?string $title,
        ?string $targetBlank,
        ?array $relNofollow
    ): self {
        return new self(
            $href,
            $title,
            $targetBlank,
            $relNofollow
        );
    }

    /**
     * @param array<string, string> $array
     */
    public static function fromArray(array $array): self
    {
        return new self(
            new Uri($array['href']),
            $array['title'] ?? null,
            $array['targetBlank'] ?? null,
            $array['relNofollow'] ?? null,
        );
    }

    public static function fromString(string $string): self
    {
        return new self(
            new Uri($string),
            null,
            null,
            null,
        );
    }

    /**
     * @return array<string, string>
     */
    public function jsonSerialize(): array
    {
        return [
            'href' => $this->href->__toString(),
            'title' => $this->title,
            'targetBlank' => $this->targetBlank,
            'relNofollow' => $this->relNofollow,
        ];
    }
}
