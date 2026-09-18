<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Day;
use App\Entity\Year;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<Year, Year>
 */
final class YearPersistProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<Year, Year> $persistProcessor
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Year
    {
        if ($data instanceof Year && $data->getDays()->isEmpty()) {
            $this->generateDays($data);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }

    private function generateDays(Year $year): void
    {
        $y = $year->getYear();
        $region = $year->getRegion();
        $start = new \DateTimeImmutable(sprintf('%d-01-01', $y));
        $end = new \DateTimeImmutable(sprintf('%d-12-31', $y));

        for ($date = $start; $date <= $end; $date = $date->modify('+1 day')) {
            $day = new Day($year, $date);
            $publicHoliday = $region->getPublicHoliday($date);
            if (null !== $publicHoliday) {
                $day->setPublicHoliday($publicHoliday);
            }
            $year->addDay($day);
        }
    }
}
