<?php

declare(strict_types=1);

namespace App\Tests\State;

use App\Entity\Year;
use App\Enum\PublicHoliday;
use App\Enum\Region;
use App\State\YearPersistProcessor;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class YearPersistProcessorTest extends TestCase
{
    public function testGeneratesDaysAndHolidaysForBayern(): void
    {
        $year = new Year(2023);
        $year->setRegion(Region::BY);

        $inner = new class implements ProcessorInterface {
            public function process(mixed $data, $operation, array $uriVariables = [], array $context = []): mixed
            {
                return $data;
            }
        };

        $processor = new YearPersistProcessor($inner);
        $result = $processor->process($year, new Post());

        self::assertSame(365, $result->getDays()->count());
        $newYear = $result->getDay(new \DateTimeImmutable('2023-01-01'));
        self::assertNotNull($newYear);
        self::assertSame(PublicHoliday::NEW_YEAR, $newYear->getPublicHoliday());
    }
}
